"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { VelocityButton } from "@/components/ui/VelocityButton";
import Navbar from "@/components/shared/Navbar";
import RotatingEarth from "@/components/ui/RotatingEarth";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-velocity-blue selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-velocity-blue/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-velocity-lime/10 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />

          {/* Desktop Earth — plug in AI video: add  videoSrc="/earth.mp4"  once you have the file */}
          <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 hidden lg:block">
            <RotatingEarth size={720} opacity={0.45} showHUD showParticles />
          </div>
          {/* Mobile earth — smaller, centered behind text */}
          <div className="absolute right-[-20%] top-1/2 -translate-y-1/2 block lg:hidden">
            <RotatingEarth size={400} opacity={0.18} showHUD={false} showParticles />
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 border border-velocity-blue/30 text-velocity-blue text-sm font-bebas tracking-widest uppercase mb-6 glass">
              Innovation in Motion
            </span>
            <h1 className="text-6xl md:text-9xl font-bebas leading-none mb-6 tracking-tighter">
              <span className="block text-white">REDESIGN YOUR</span>
              <span className="block text-gradient">VELOCITY</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-inter font-light tracking-wide">
              Elite performance gear engineered for the next generation of athletes.
              Push boundaries, break records, and experience the future of sports.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/products" className="w-full sm:w-auto">
                <VelocityButton variant="primary" size="lg" className="w-full">
                  Explore Collection
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </VelocityButton>
              </Link>
              <Link href="/innovation" className="w-full sm:w-auto">
                <VelocityButton variant="outline" size="lg" neon={false} className="w-full">
                  View Evolution
                </VelocityButton>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bebas tracking-[0.3em] uppercase text-white/30">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-velocity-blue to-transparent" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-white/5 bg-velocity-grey/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Elite Athletes", val: "500+" },
              { label: "Record Broken", val: "128" },
              { label: "Tech Patents", val: "45" },
              { label: "Global Reach", val: "24/7" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bebas text-white mb-2">{stat.val}</div>
                <div className="text-xs font-bebas tracking-widest text-velocity-blue/60 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-[10px] font-bebas tracking-[0.3em] text-velocity-blue uppercase">Explore</span>
            <h2 className="text-4xl md:text-6xl font-bebas tracking-tighter mt-2">SHOP BY CATEGORY</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Performance", sub: "Speed & Agility Gear", href: "/category/performance" },
              { label: "Equipment", sub: "Strength & Conditioning", href: "/category/equipment" },
              { label: "Shop All", sub: "The Full Arsenal", href: "/products" },
            ].map((cat, i) => (
              <motion.a
                key={cat.label}
                href={cat.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative glass border border-white/5 hover:border-velocity-blue/30 p-10 flex flex-col justify-between min-h-[200px] overflow-hidden transition-all duration-500"
              >
                <div>
                  <div className="w-8 h-[1px] bg-velocity-blue mb-6 group-hover:w-16 transition-all duration-500" />
                  <h3 className="text-3xl font-bebas tracking-wide text-white">{cat.label}</h3>
                  <p className="text-white/40 text-sm mt-2 font-inter">{cat.sub}</p>
                </div>
                <div className="flex items-center space-x-2 mt-8">
                  <span className="text-[10px] font-bebas tracking-widest text-velocity-blue uppercase">Explore</span>
                  <ArrowRight size={12} className="text-velocity-blue group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-6 border-t border-white/5 bg-velocity-grey/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: "⚡", title: "Aerospace Materials", desc: "Carbon fibre and titanium alloy construction for unmatched strength-to-weight ratio." },
              { icon: "🧬", title: "Biometric Integration", desc: "Smart sensors embedded in every product for real-time performance tracking." },
              { icon: "🌍", title: "Global Elite Network", desc: "Used by 500+ professional athletes across 60 countries and 12 Olympic sports." },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex space-x-4"
              >
                <div className="text-3xl flex-shrink-0">{feat.icon}</div>
                <div>
                  <h4 className="font-bebas tracking-wide text-white text-lg mb-2">{feat.title}</h4>
                  <p className="text-white/40 text-sm font-inter leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-2xl font-bebas tracking-tighter text-white">
              VELOCITY <span className="text-velocity-lime">SPORTS</span>
            </span>
            <p className="text-white/20 text-xs font-inter mt-1">Next-gen gear for elite athletes.</p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-white/20 text-[10px] font-inter uppercase tracking-widest">
              Designed &amp; Developed by
            </p>
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
          <p className="text-white/10 text-[10px] font-inter">
            &copy; 2026 Velocity Sports. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/20 text-[10px] font-bebas tracking-widest hover:text-velocity-blue transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
