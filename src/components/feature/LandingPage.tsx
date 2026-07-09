"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import TerminalPreview from "../TerminalPreview";

const curriculumItems = [
  { icon: "⚿", name: "IAM & Permissions", desc: "Learn to configure users, roles, and policies. Break overpermissioned accounts and fix them.", tag: "BEGINNER", tagClass: "tag-beginner" },
  { icon: "◈", name: "Cloud Networking", desc: "VPCs, subnets, route tables, security groups. Diagnose misconfigured network scenarios.", tag: "BEGINNER", tagClass: "tag-beginner" },
  { icon: "λ", name: "Serverless & Lambda", desc: "Trigger functions, debug cold starts, fix broken event pipelines in simulated environments.", tag: "INTERMEDIATE", tagClass: "tag-intermediate" },
  { icon: "⬡", name: "Containers & Docker", desc: "Build, tag, push, and debug container images. Fix broken Dockerfiles and registries.", tag: "INTERMEDIATE", tagClass: "tag-intermediate" },
  { icon: "◻", name: "Infrastructure as Code", desc: "Write and debug Terraform configs. Apply, plan, destroy — without touching real infrastructure.", tag: "ADVANCED", tagClass: "tag-advanced" },
  { icon: "⎈", name: "Kubernetes", desc: "Pods, deployments, services, ingress. Fix broken clusters and misconfigured workloads.", tag: "ADVANCED", tagClass: "tag-advanced" },
];

const steps = [
  {
    num: "01",
    icon: "📋",
    title: "GET A MISSION",
    desc: "You're dropped into a broken cloud environment. Read the brief. Understand what went wrong.",
  },
  {
    num: "02",
    icon: "💻",
    title: "USE THE TERMINAL",
    desc: "Type real AWS and Linux commands directly in your browser. No cloud account needed.",
  },
  {
    num: "03",
    icon: "🏆",
    title: "EARN XP & LEVEL UP",
    desc: "Complete objectives, find the flag, unlock the next mission. Track your progress.",
  },
];

function useInView(ref: React.RefObject<Element | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

function SectionObserver({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useInView(ref);
  return <div ref={ref} className={`fade-up ${className}`}>{children}</div>;
}

export default function LandingPage() {
  const router = useRouter();
  const stepsRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);

  useInView(stepsRef);
  useInView(curriculumRef);

  return (
    <>
      {/* ─── HERO ─── */}
      <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-[#050a05]">
        <div className="absolute inset-0 z-0 vine-bg">
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" stroke="#00ff41" strokeWidth="1.5" opacity="0.6">
              <path d="M0,900 C100,800 80,600 200,500 C320,400 280,250 400,150 C520,50 500,-50 600,100" />
              <path d="M600,100 C620,150 580,200 620,260 C660,320 640,400 700,450" />
              <path d="M200,500 C220,480 240,490 260,470 C280,450 240,430 200,500" />
              <path d="M1440,900 C1300,750 1350,600 1200,500 C1050,400 1100,300 950,200 C800,100 850,0 700,-50" />
              <path d="M950,200 C920,230 900,210 880,240 C860,270 890,290 950,200" />
              <path d="M200,900 C300,850 250,700 400,600 C550,500 500,350 650,250 C800,150 750,50 900,0" />
              <path d="M400,600 C430,580 450,600 470,570 C490,540 450,520 400,600" />
              <path d="M1200,900 C1100,800 1150,650 1000,550 C850,450 900,300 750,200 C600,100 650,0 500,-50" />
              <path d="M1000,550 C970,570 950,550 930,580 C910,610 940,630 1000,550" />
              <path d="M720,900 C750,780 680,650 800,520 C920,390 860,250 1000,120 C1140,-10 1080,-80 1200,-100" />
              <path d="M800,520 C820,540 830,520 850,540 C870,560 840,580 800,520" />
              <path d="M50,100 C150,200 100,350 250,450 C400,550 350,700 500,800 C650,900 600,950 750,900" />
              <path d="M250,450 C270,430 290,450 310,420 C330,390 290,370 250,450" />
            </g>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
          <h1 className="hero-title text-5xl tracking-[0.15em]">
            CloudHero
          </h1>
          <p className="text-lg opacity-60 tracking-wider">
            Learn cloud by breaking it. No account needed. Just a terminal.
          </p>
          <p className="text-xs opacity-40 italic tracking-wide">
            Tip: type `help` in any mission terminal to see available commands
          </p>

          <div className="mt-4 w-full">
            <TerminalPreview onNavigate={() => router.push("/login")} />
          </div>
        </div>

        <footer className="absolute bottom-6 z-10 text-xs opacity-30 tracking-wider">
          Currently in beta
        </footer>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section className="w-full bg-[#000] py-24 px-4">
        <SectionObserver className="max-w-5xl mx-auto text-center">
          <h2 className="glow-text text-3xl tracking-[0.12em] mb-16">
            How It Works
          </h2>
        </SectionObserver>

        <div ref={stepsRef} className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <div className="fade-up-stagger flex-1 text-center md:text-left px-4">
                <span className="text-xs opacity-40 tracking-widest">{step.num}</span>
                <h3 className="text-lg font-bold text-[#00e535] mt-1">{step.icon} {step.title}</h3>
                <p className="text-sm opacity-60 mt-2 leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && <div className="step-divider hidden md:block h-16 mx-4" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ─── CURRICULUM PREVIEW ─── */}
      <section className="w-full bg-[#050a05] py-24 px-4">
        <SectionObserver className="max-w-5xl mx-auto text-center">
          <h2 className="glow-text text-3xl tracking-[0.12em] mb-16">
            What You&rsquo;ll Master
          </h2>
        </SectionObserver>

        <div ref={curriculumRef} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {curriculumItems.map((item) => (
            <div key={item.name} className="fade-up-stagger curriculum-card rounded px-5 py-6 text-left">
              <div className="flex items-start gap-3">
                <span className="text-[#00e535] text-lg mt-0.5 shrink-0">[{item.icon}]</span>
                <div>
                  <h3 className="text-[#00e535] font-bold text-sm tracking-wide">{item.name}</h3>
                  <p className="text-xs opacity-60 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
              <div className={`tag mt-4 pt-3 border-t border-[#00e535]/20 ${item.tagClass}`}>{item.tag}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="w-full bg-[#000] py-24 px-4 text-center">
        <SectionObserver>
          <h2 className="hero-title text-4xl tracking-[0.12em]">
            Ready for your first mission?
          </h2>
          <p className="text-sm opacity-60 mt-4 tracking-wider">
            No cloud account. No credit card. Just you and a terminal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button
              className="border border-[#00e535] bg-transparent px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300 hover:bg-[#00e535]/10 cursor-pointer"
            >
              Read the Docs
            </button>
          </div>

          <p className="text-sm opacity-50 mt-10 tracking-wide">
            {"> system ready. awaiting input"}
            <span className="blink-cursor">_</span>
          </p>
        </SectionObserver>
      </section>

      <footer className="w-full bg-[#000] py-6 text-center">
        <p className="text-[0.65rem] opacity-30 tracking-widest">
          &copy; 2025 CloudHero. Learn cloud. By breaking it.
        </p>
      </footer>
    </>
  );
}
