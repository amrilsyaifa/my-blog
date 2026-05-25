"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import gsap from "gsap";
import dynamic from "next/dynamic";
import useTypewriter from "@components/hooks/useTypewriter";

const AvatarScene = dynamic(
  () => import("@components/components/AvatarScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    ),
  },
);

const TECH_STACK = [
  "React",
  "TypeScript",
  "Next.js",
  "Golang",
  "Node.js",
  "React Native",
  "Laravel",
  "AI/ML",
  "Three.js",
  "Firebase",
  "PostgreSQL",
  "GraphQL",
  "Docker",
  "Microservices",
  "AWS",
  "Tailwind CSS",
];

interface HomeHeroProps {
  description: string;
  more: string;
  projectsLabel: string;
}

export default function HomeHero({
  description,
  more,
  projectsLabel,
}: HomeHeroProps) {
  const { locale } = useParams();
  const roleText = useTypewriter("Software Engineer", 80);
  const heroRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7 },
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3",
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2",
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2",
      );
  }, []);

  useEffect(() => {
    if (!marqueeRef.current) return;
    gsap.to(marqueeRef.current, {
      x: "-50%",
      duration: 22,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <section ref={heroRef} className="min-h-screen flex flex-col pt-16">
      {/* Main hero content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-screen-xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left — text */}
          <div className="flex flex-col gap-5 lg:pr-8">
            <div className="flex items-center gap-2">
              <span className="w-8 h-px bg-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">
                Hi, I&apos;m
              </span>
            </div>

            <h1
              ref={nameRef}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              style={{ opacity: 0 }}
            >
              <span className="text-text-primary">Amril</span>
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                }}
              >
                Syaifa Yasin
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-xl md:text-2xl text-text-secondary font-light min-h-[2rem]"
              style={{ opacity: 0 }}
            >
              {roleText}
            </p>

            <p
              ref={descRef}
              className="text-text-secondary leading-relaxed max-w-md"
              style={{ opacity: 0 }}
            >
              {description}
            </p>

            <div
              ref={ctaRef}
              className="flex items-center gap-4 flex-wrap pt-2"
              style={{ opacity: 0 }}
            >
              <Link
                href={`/${locale}/about`}
                className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-glow-md hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                }}
              >
                {more}
              </Link>
              <Link
                href={`/${locale}/project`}
                className="px-6 py-3 rounded-lg font-semibold text-text-primary border border-border hover:border-accent hover:text-accent transition-all duration-300 hover:-translate-y-0.5"
              >
                {projectsLabel}
              </Link>
            </div>

            {/* Decorative dots */}
            <div className="flex gap-2 pt-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: i < 3 ? "#6366f1" : "#2d3748",
                    opacity: 1 - i * 0.15,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right — 3D scene */}
          <div className="relative h-[480px] lg:h-[560px]">
            {/* Glow behind scene */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, #6366f1 0%, transparent 70%)",
              }}
            />
            <AvatarScene />
          </div>
        </div>
      </div>

      {/* Tech stack marquee strip */}
      <div className="w-full overflow-hidden border-y border-border/40 py-3 mt-8">
        <div
          ref={marqueeRef}
          className="flex gap-12 whitespace-nowrap"
          style={{ width: "200%" }}
        >
          {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
            <span
              key={i}
              className="text-xs font-semibold tracking-widest uppercase text-text-muted"
            >
              {tech}
              <span className="ml-12 text-accent opacity-40">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
