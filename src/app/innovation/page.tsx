"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import { ArrowRight, Zap, Cpu, Globe, FlaskConical, Trophy, Layers } from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const milestones = [
  {
    year: "2018",
    title: "The Origin",
    desc: "Velocity Sports was born in a small research lab, driven by a single question: what if athletic gear was built like spacecraft? Our founders — ex-aerospace engineers — set out to prove that peak performance starts with the materials.",
    icon: "🔬",
    tag: "Founding",
    side: "left",
  },
  {
    year: "2019",
    title: "Carbon Core™",
    desc: "We filed our first 12 patents covering the Carbon Core™ composite — a woven lattice of aerospace-grade carbon fibre and titanium micro-fibres that is 3× lighter than aluminium yet stiffer than steel.",
    icon: "🧱",
    tag: "Patent Filed",
    side: "right",
  },
  {
    year: "2020",
    title: "Biometric Weave",
    desc: "Embedding pressure, EMG, and temperature sensors directly into the fabric — no dongles, no clips. The first sports garment to capture muscle-activation maps in real time and stream them to any device via BLE 5.2.",
    icon: "🧬",
    tag: "Breakthrough",
    side: "left",
  },
  {
    year: "2021",
    title: "Olympic Debut",
    desc: "120 athletes across 14 disciplines wore Velocity gear at the Tokyo games. 38 of them set personal bests. Three broke world records. The sports world took notice.",
    icon: "🏅",
    tag: "Milestone",
    side: "right",
  },
  {
    year: "2022",
    title: "AdaptFlow™ AI",
    desc: "Our onboard AI micro-chip dynamically adjusts compression zones in under 8 ms — faster than any reflex. AdaptFlow™ shifts support from muscle group to muscle group as each stride demands, reducing injury risk by 41%.",
    icon: "🤖",
    tag: "AI Innovation",
    side: "left",
  },
  {
    year: "2023",
    title: "Global Network",
    desc: "Partnerships with 500+ elite athletes across 60 countries. Velocity Intelligence Cloud aggregates 4 billion data points per day, continuously refining every product iteration through machine learning.",
    icon: "🌍",
    tag: "Global Scale",
    side: "right",
  },
  {
    year: "2024",
    title: "Quantum Sole™",
    desc: "Leveraging metamaterial physics — structures not found in nature — to engineer a midsole that stores kinetic energy during heel-strike and releases it at toe-off with 94% efficiency. The closest thing to a spring in your shoe.",
    icon: "⚡",
    tag: "Materials Science",
    side: "left",
  },
  {
    year: "2026",
    title: "The Next Horizon",
    desc: "Velocity 3.0 is in R&D: neural-integrated haptic feedback, self-healing nano-coatings, and a zero-carbon supply chain certified by 2027. The future of sport is not a destination — it is a continuous reinvention.",
    icon: "🚀",
    tag: "Coming Soon",
    side: "right",
  },
];

const pillars = [
  {
    icon: Cpu,
    title: "AdaptFlow™ AI",
    desc: "Onboard microprocessors and embedded ML models that respond to your body 125× per second — smarter than instinct.",
    color: "#00f2ff",
  },
  {
    icon: Layers,
    title: "Carbon Core™",
    desc: "Aerospace-spec carbon-titanium lattice structures that make every gram count and every force vector work for you.",
    color: "#ccff00",
  },
  {
    icon: FlaskConical,
    title: "Nano-Coat",
    desc: "Self-healing polymer surface treatment repels moisture, resists abrasion, and restores itself after micro-scratches.",
    color: "#00f2ff",
  },
  {
    icon: Zap,
    title: "Quantum Sole™",
    desc: "Metamaterial midsole geometry stores heel-strike energy and releases it at toe-off with 94% efficiency.",
    color: "#ccff00",
  },
  {
    icon: Globe,
    title: "Intelligence Cloud",
    desc: "4B daily data points from elite athletes refine every product iteration. The gear literally gets better as you train.",
    color: "#00f2ff",
  },
  {
    icon: Trophy,
    title: "Olympic Proven",
    desc: "Worn by 120+ athletes at the 2021 Games. Three world records. Zero failures. Performance at the limit.",
    color: "#ccff00",
  },
];

const stats = [
  { val: "45+", label: "Tech Patents" },
  { val: "4B", label: "Data Points / Day" },
  { val: "94%", label: "Energy Return" },
  { val: "3×", label: "Lighter Than Aluminium" },
];

/* ─────────────────────────────────────────────
   HERO PARALLAX
───────────────────────────────────────────── */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "linear-gradient(rgba(0,242,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,255,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-velocity-blue/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-velocity-lime/8 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Large background text */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[20vw] font-bebas tracking-tighter text-white/[0.025] leading-none">EVOLUTION</span>
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1 border border-velocity-blue/30 text-velocity-blue text-sm font-bebas tracking-widest uppercase mb-6 glass">
            The Velocity Story
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-7xl md:text-[10rem] font-bebas leading-none tracking-tighter mb-6"
        >
          <span className="block text-white">THE</span>
          <span className="block text-gradient">EVOLUTION</span>
          <span className="block text-white">OF SPORT</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white/50 text-lg md:text-xl font-inter font-light max-w-2xl mx-auto leading-relaxed"
        >
          From a garage lab to the Olympic podium — the story of how aerospace engineering rewrote the rules of athletic performance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-[-40vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bebas tracking-[0.3em] uppercase text-white/30">Scroll Through Time</span>
          <div className="w-px h-12 bg-gradient-to-b from-velocity-blue to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TIMELINE ITEM
───────────────────────────────────────────── */
function TimelineItem({ item, index }: { item: (typeof milestones)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = item.side === "left";

  return (
    <div ref={ref} className={`relative flex items-start gap-8 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className={`w-full md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"}`}
      >
        <div className={`glass border border-white/5 hover:border-velocity-blue/30 p-8 transition-all duration-500 group relative overflow-hidden`}>
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-velocity-blue/60" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-velocity-blue/60" />

          {/* Glow on hover */}
          <div className="absolute inset-0 bg-velocity-blue/0 group-hover:bg-velocity-blue/[0.03] transition-all duration-500" />

          <div className={`flex items-center gap-3 mb-4 ${isLeft ? "md:justify-end" : "justify-start"}`}>
            <span className="text-3xl">{item.icon}</span>
            <span className="text-[10px] font-bebas tracking-[0.25em] uppercase px-3 py-1 border border-velocity-blue/30 text-velocity-blue">
              {item.tag}
            </span>
          </div>
          <p className="text-5xl font-bebas text-white/10 leading-none mb-1">{item.year}</p>
          <h3 className="text-2xl md:text-3xl font-bebas tracking-wide text-white mb-3">{item.title}</h3>
          <p className="text-white/50 font-inter text-sm leading-relaxed">{item.desc}</p>
        </div>
      </motion.div>

      {/* Center spine node */}
      <div className="hidden md:flex flex-col items-center w-16 flex-shrink-0 relative">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-4 h-4 rounded-full bg-velocity-blue border-4 border-background relative z-10"
          style={{ boxShadow: "0 0 18px rgba(0,242,255,0.7)" }}
        />
      </div>

      {/* Spacer for alternating side */}
      <div className="hidden md:block w-[calc(50%-2rem)]" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   PILLARS SECTION
───────────────────────────────────────────── */
function PillarsSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-velocity-blue/0 via-velocity-blue/40 to-velocity-blue/0" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-bebas tracking-[0.3em] text-velocity-blue uppercase">Core Technologies</span>
          <h2 className="text-5xl md:text-7xl font-bebas tracking-tighter mt-3 text-white">
            BUILT ON <span className="text-gradient">6 PILLARS</span>
          </h2>
          <p className="text-white/40 font-inter text-sm max-w-xl mx-auto mt-4 leading-relaxed">
            Every Velocity product is the convergence of six foundational innovations that redefine what athletic gear can do.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass border border-white/5 hover:border-velocity-blue/30 p-8 relative group overflow-hidden transition-all duration-500"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-velocity-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div
                  className="w-12 h-12 flex items-center justify-center mb-6 relative"
                  style={{ boxShadow: `0 0 20px ${p.color}30` }}
                >
                  <div className="absolute inset-0 border border-current opacity-20" style={{ color: p.color }} />
                  <Icon size={20} style={{ color: p.color }} />
                </div>
                <h4 className="font-bebas text-xl tracking-wide text-white mb-3">{p.title}</h4>
                <p className="text-white/40 text-sm font-inter leading-relaxed">{p.desc}</p>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-700" style={{ background: `linear-gradient(to right, ${p.color}, transparent)` }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   STATS BANNER
───────────────────────────────────────────── */
function StatsBanner() {
  return (
    <section className="py-20 border-y border-white/5 bg-velocity-grey/40 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(0,242,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-5xl md:text-6xl font-bebas text-gradient leading-none mb-2">{s.val}</div>
              <div className="text-[10px] font-bebas tracking-widest text-white/40 uppercase">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA SECTION
───────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-40 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-velocity-blue/10 rounded-full blur-[150px]" />
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[10px] font-bebas tracking-[0.3em] text-velocity-blue uppercase">Join The Movement</span>
          <h2 className="text-6xl md:text-8xl font-bebas tracking-tighter mt-4 mb-6">
            <span className="text-white">YOUR </span>
            <span className="text-gradient">EVOLUTION</span>
            <span className="text-white"> STARTS NOW</span>
          </h2>
          <p className="text-white/40 font-inter max-w-lg mx-auto mb-12 leading-relaxed">
            Explore the gear that has redefined performance for 500+ elite athletes. Now it is your turn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 bg-velocity-blue text-black font-bebas tracking-wider px-10 py-4 text-lg hover:bg-white transition-all duration-300 neon-glow-blue relative overflow-hidden"
            >
              <span className="relative z-10">Shop The Collection</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              <div className="absolute top-0 left-0 w-1 h-1 bg-white" />
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-white" />
            </Link>
            <Link
              href="/category/performance"
              className="group inline-flex items-center gap-3 border-2 border-velocity-blue/40 text-velocity-blue font-bebas tracking-wider px-10 py-4 text-lg hover:border-velocity-blue hover:bg-velocity-blue/10 transition-all duration-300"
            >
              Performance Gear
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function EvolutionPage() {
  return (
    <main className="min-h-screen bg-background selection:bg-velocity-blue selection:text-black">
      <Navbar />

      <HeroSection />

      {/* Timeline */}
      <section className="py-32 px-6 relative">
        {/* Vertical spine */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-velocity-blue/20 to-transparent" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-[10px] font-bebas tracking-[0.3em] text-velocity-blue uppercase">Since 2018</span>
            <h2 className="text-5xl md:text-7xl font-bebas tracking-tighter mt-3 text-white">
              THE <span className="text-gradient">TIMELINE</span>
            </h2>
          </motion.div>

          <div className="flex flex-col gap-16 md:gap-24 relative">
            {milestones.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      <StatsBanner />
      <PillarsSection />
      <CTASection />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-2xl font-bebas tracking-tighter text-white">
              VELOCITY <span className="text-velocity-lime">SPORTS</span>
            </span>
            <p className="text-white/20 text-xs font-inter mt-1">Next-gen gear for elite athletes.</p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-white/20 text-[10px] font-inter uppercase tracking-widest">Designed &amp; Developed by</p>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-bebas text-2xl tracking-widest text-gradient"
            >
              NISCHAY
            </motion.p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/10 text-[10px] font-inter">&copy; 2026 Velocity Sports. All rights reserved.</p>
          <div className="flex space-x-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a key={link} href="#" className="text-white/20 text-[10px] font-bebas tracking-widest hover:text-velocity-blue transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
