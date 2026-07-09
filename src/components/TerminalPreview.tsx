"use client";

import { useState, useEffect, useRef } from "react";

type SegmentType = "command" | "output" | "blank";

interface Segment {
  type: SegmentType;
  text: string;
}

const segments: Segment[] = [
  { type: "command", text: "$ aws s3 ls" },
  { type: "blank", text: "" },
  { type: "output", text: "corp-backups-2024    PUBLIC   ⚠ EXPOSED" },
  { type: "output", text: "app-assets           private  ✓ secure" },
  { type: "output", text: "internal-logs        private  ✓ secure" },
  { type: "blank", text: "" },
  { type: "command", text: "$ cloudhero check" },
  { type: "blank", text: "" },
  { type: "output", text: "[✓] Objective 1: Identify the exposed bucket — COMPLETE" },
  { type: "output", text: "[ ] Objective 2: Fix the bucket ACL — pending..." },
  { type: "blank", text: "" },
  { type: "command", text: "$ aws s3api put-bucket-acl --bucket corp-backups-2024 --acl private" },
  { type: "blank", text: "" },
  { type: "output", text: "[✓] Objective 2: Fix the bucket ACL — COMPLETE" },
  { type: "output", text: "[🏁] FLAG{s3_acl_hardened} — Mission complete! +150 XP" },
];

const CHAR_MS = 30;
const LINE_MS = 180;
const BLANK_MS = 400;

interface TerminalPreviewProps {
  onNavigate: () => void;
}

export default function TerminalPreview({ onNavigate }: TerminalPreviewProps) {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [partialLine, setPartialLine] = useState("");
  const [interactive, setInteractive] = useState(false);
  const [inputBuffer, setInputBuffer] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedule = (fn: () => void, ms: number) => {
    timerRef.current = setTimeout(fn, ms);
  };

  useEffect(() => {
    let segIdx = 0;
    let charIdx = 0;
    let lines: string[] = [];
    let partial = "";

    const tick = () => {
      if (segIdx >= segments.length) {
        setTypedLines(lines);
        setPartialLine("");
        setInteractive(true);
        return;
      }

      const seg = segments[segIdx];

      if (seg.type === "blank") {
        lines = [...lines, ""];
        setTypedLines(lines);
        segIdx++;
        schedule(tick, BLANK_MS);
        return;
      }

      if (seg.type === "output") {
        lines = [...lines, seg.text];
        setTypedLines(lines);
        segIdx++;
        schedule(tick, LINE_MS);
        return;
      }

      if (seg.type === "command") {
        if (charIdx < seg.text.length) {
          partial += seg.text[charIdx];
          setPartialLine(partial);
          charIdx++;
          schedule(tick, CHAR_MS);
        } else {
          lines = [...lines, partial];
          setTypedLines(lines);
          setPartialLine("");
          partial = "";
          charIdx = 0;
          segIdx++;
          schedule(tick, LINE_MS);
        }
      }
    };

    schedule(tick, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (interactive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [interactive]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    const newLines = [...typedLines, `$ ${trimmed}`];
    setTypedLines(newLines);
    setInputBuffer("");
    setCommandHistory((prev) => [...prev, trimmed]);

    if (trimmed === "cd login") {
      onNavigate();
      return;
    }

    if (trimmed === "help") {
      setTypedLines((prev) => [
        ...prev,
        "Available commands:",
        "  cd login       — enter the mission control",
        "  help           — show this message",
        "  clear          — clear the terminal",
        "  ls, whoami     — try them and see",
      ]);
      return;
    }

    if (trimmed === "clear") {
      setTypedLines([]);
      return;
    }

    if (trimmed === "ls") {
      setTypedLines((prev) => [
        ...prev,
        "missions/",
        "docs/",
        "profile",
        "README.md",
      ]);
      return;
    }

    if (trimmed === "whoami") {
      setTypedLines((prev) => [
        ...prev,
        "cloudhero-agent",
      ]);
      return;
    }

    setTypedLines((prev) => [
      ...prev,
      `bash: ${trimmed.split(" ")[0]}: command not found`,
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputBuffer);
    } else if (e.key === "Backspace") {
      setInputBuffer((prev) => prev.slice(0, -1));
    } else if (e.key.length === 1) {
      setInputBuffer((prev) => prev + e.key);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [typedLines, inputBuffer]);

  return (
    <div className="w-full max-w-[600px] mx-auto" onClick={() => inputRef.current?.focus()}>
      <div className="border border-[#00e535]/30 rounded-t bg-[#0a0f0a]/90 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#00e535]/20 bg-[#050a05]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#e53b00]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#e5b800]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#00e535]/60" />
          <span className="text-[0.65rem] opacity-40 tracking-wider ml-2">
            mission-01 — cloudhero terminal
          </span>
        </div>
        <div ref={scrollRef} className="p-4 text-left text-sm leading-relaxed whitespace-pre-wrap font-mono min-h-[220px] max-h-[360px] overflow-y-auto">
          {typedLines.map((line, i) => (
            <div key={i} className="leading-relaxed">
              {line === "" ? <>&nbsp;</> : line}
            </div>
          ))}
          {partialLine !== "" && !interactive && (
            <div className="leading-relaxed">
              {partialLine}<span className="blink-cursor">_</span>
            </div>
          )}
          {interactive && (
            <div className="leading-relaxed flex items-center">
              <span>$&nbsp;</span>
              <span>{inputBuffer}</span>
              <span className="blink-cursor">_</span>
            </div>
          )}
        </div>
        {interactive && (
          <input
            ref={inputRef}
            type="text"
            className="absolute w-0 h-0 opacity-0 pointer-events-none"
            aria-hidden="true"
            onKeyDown={handleKeyDown}
            onBlur={(e) => e.target.focus()}
          />
        )}
      </div>
    </div>
  );
}
