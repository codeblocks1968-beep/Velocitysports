"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Timer, Activity } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import ProductCard from "@/components/shared/ProductCard";
import { VelocityButton } from "@/components/ui/VelocityButton";

const PERFORMANCE_PRODUCTS = [
  {
    id: "p1",
    name: "HyperStride Pro Shoes",
    price: "$299.00",
    image: "/images/products/kettlebell.png",
    category: "Footwear",
    variant: "blue" as const,
  },
  {
    id: "p2",
    name: "AeroSkin Compression Suit",
    price: "$189.00",
    image: "/images/products/resistance-bands.png",
    category: "Apparel",
    variant: "lime" as const,
  },
  {
    id: "p3",
    name: "Sprint Parachute Harness",
    price: "$119.00",
    image: "/images/products/kettlebell.png",
    category: "Speed Training",
    variant: "blue" as const,
  },
  {
    id: "p4",
    name: "Reactive Agility Ladder",
    price: "$79.00",
    image: "/images/products/resistance-bands.png",
    category: "Agility",
    variant: "lime" as const,
  },
  {
    id: "p5",
    name: "NeuroBand Wrist Sensor",
    price: "$229.00",
    image: "/images/products/kettlebell.png",
    category: "Wearables",
    variant: "blue" as const,
  },
  {
    id: "p6",
    name: "Carbon Fibre Shin Guards",
    price: "$149.00",
    image: "/images/products/resistance-bands.png",
    category: "Protection",
    variant: "lime" as const,
  },
];

const FILTERS = ["All", "Footwear", "Apparel", "Speed Training", "Agility", "Wearables", "Protection"];

const STATS = [
  { icon: <Zap size={20} />, value: "40%", label: "Speed Increase" },
  { icon: <Timer size={20} />, value: "0.3s", label: "Avg. Reaction Gain" },
  { icon: <Activity size={20} />, value: "98%", label: "Athletes Satisfied" },
];

export default function PerformancePage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? PERFORMANCE_PRODUCTS
      : PERFORMANCE_PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <main className="min-h-screen bg-background text-white selection:bg-velocity-blue selection:text-black">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden px-6 pb-20 pt-40">
        {/* Animated BG */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-velocity-blue/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-velocity-lime/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        {/* Large background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <span className="text-[20vw] font-bebas text-white/[0.02] tracking-tighter select-none">
            SPEED
          </span>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1 border border-velocity-blue/30 text-velocity-blue text-[10px] font-bebas tracking-[0.3em] uppercase mb-8 glass">
              Category — Performance
            </span>
            <h1 className="text-6xl md:text-9xl font-bebas tracking-tighter leading-none mb-6">
              <span className="block text-white">BUILT FOR</span>
              <span className="block text-gradient">SPEED</span>
            </h1>
            <p className="text-white/50 max-w-xl font-inter font-light text-lg mb-10">
              Every millisecond counts. Our performance line is precision-engineered to shave time, amplify agility, and push your limits beyond what you thought possible.
            </p>
            <div className="flex items-center space-x-6">
              <VelocityButton variant="primary" size="lg">
                Shop Performance
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </VelocityButton>
              <a href="/products" className="text-[10px] font-bebas tracking-widest text-white/30 hover:text-white transition-colors uppercase">
                View All Products
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Performance Stats Bar ── */}
      <section className="border-y border-white/5 bg-velocity-grey/40 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center space-y-2"
            >
              <div className="text-velocity-blue">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bebas text-white">{stat.value}</div>
              <div className="text-[10px] font-bebas tracking-widest text-white/30 uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Technology Callout ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-bebas tracking-[0.3em] text-velocity-lime uppercase">
              The Science
            </span>
            <h2 className="text-4xl md:text-6xl font-bebas tracking-tighter mt-3 mb-6 leading-none">
              VELOCITY<br />
              <span className="text-velocity-blue">PROPULSION</span><br />
              TECH™
            </h2>
            <p className="text-white/50 font-inter font-light leading-relaxed mb-8">
              Our proprietary VPT™ framework combines adaptive force-return foam, electrospun graphene weave, and real-time biometric feedback to create the most responsive performance gear on the planet.
            </p>
            <div className="space-y-4">
              {[
                "Adaptive force-return sole tech",
                "Graphene-woven compression fabric",
                "Real-time motion telemetry",
              ].map((feat) => (
                <div key={feat} className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-velocity-blue flex-shrink-0" />
                  <span className="text-sm font-inter text-white/60">{feat}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass border border-white/10 p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-velocity-blue/20 rounded-full blur-[60px]" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Response Time", val: "8ms" },
                  { label: "Energy Return", val: "94%" },
                  { label: "Weight Reduction", val: "31%" },
                  { label: "Durability Rating", val: "9.8/10" },
                ].map((item) => (
                  <div key={item.label} className="glass p-4">
                    <div className="text-2xl font-bebas text-velocity-blue mb-1">{item.val}</div>
                    <div className="text-[10px] font-inter text-white/30 uppercase tracking-widest">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Product Filter + Grid ── */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Filter Bar */}
          <div className="sticky top-[72px] z-40 glass border-y border-white/5 -mx-6 px-6 py-4 mb-12">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`flex-shrink-0 px-4 py-1.5 text-[10px] font-bebas tracking-widest uppercase transition-all ${
                      activeFilter === f
                        ? "bg-velocity-blue text-black"
                        : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-white/20 font-bebas tracking-widest hidden md:block">
                {filtered.length} PRODUCTS
              </span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="py-24 px-6 border-t border-white/5 bg-velocity-grey/30 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-velocity-blue/5 rounded-full blur-[120px] -translate-x-1/2" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="text-5xl text-velocity-blue font-bebas mb-6">&ldquo;</div>
          <p className="text-2xl md:text-3xl font-bebas tracking-wide text-white leading-snug mb-8">
            Velocity gear shaved 0.4 seconds off my 100m time in two weeks. The tech is unlike anything else on the market.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-velocity-blue/20 border border-velocity-blue/30 flex items-center justify-center">
              <span className="text-velocity-blue font-bebas text-sm">JR</span>
            </div>
            <div className="text-left">
              <p className="font-bebas tracking-widest text-white text-sm">JAMES R.</p>
              <p className="text-[10px] text-white/30 font-inter">Olympic Sprinter, 100m World Bronze Medalist</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bebas mb-4">
            READY TO BREAK YOUR <span className="text-velocity-blue">RECORD?</span>
          </h2>
          <p className="text-white/40 mb-8 font-inter text-sm">
            Join thousands of athletes already training with Velocity performance gear.
          </p>
          <VelocityButton variant="primary" size="lg">
            Shop All Performance
            <ArrowRight className="inline-block ml-2 w-4 h-4" />
          </VelocityButton>
        </div>
      </section>
    </main>
  );
}
