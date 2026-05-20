"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { VelocityButton } from "@/components/ui/VelocityButton";
import Navbar from "@/components/shared/Navbar";
import RotatingEarth from "@/components/ui/RotatingEarth";
import { ArrowRight, Activity, Sparkles, Copy, Check } from "lucide-react";

export default function Home() {
  // Bio-Age Discount Calibrator states
  const [ageInput, setAgeInput] = useState("");
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibStep, setCalibStep] = useState(0);
  const [discountResult, setDiscountResult] = useState<{
    code: string;
    percentage: number;
    title: string;
    desc: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const calibrationTexts = [
    "ANALYZING BIOLOGICAL METRICS...",
    "MAPPING DEMOGRAPHIC SPEED CURVE...",
    "GENERATING PROPORTIONAL DISCOUNT INDEX...",
  ];

  const handleCalibrate = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(ageInput);

    if (isNaN(age) || age <= 0 || age > 120) {
      setErrorMsg("Please enter a valid biological age (1-120).");
      return;
    }

    setErrorMsg("");
    setIsCalibrating(true);
    setCalibStep(0);
    setDiscountResult(null);

    // Multi-stage loading animation
    const interval = setInterval(() => {
      setCalibStep((prev) => {
        if (prev >= calibrationTexts.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            calculateDiscount(age);
          }, 400);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  const calculateDiscount = (age: number) => {
    let code = "BIO-BASE-10";
    let percentage = 10;
    let title = "BASE BIOMETRIC LOG";
    let desc = "Standard entry calibration discount for training start.";

    if (age <= 18) {
      code = "BIO-YOUTH-20";
      percentage = 20;
      title = "YOUTH VELOCITY AMPLIFIER";
      desc = "Supporting high-growth biological potential. Energize your performance.";
    } else if (age <= 35) {
      code = "BIO-PEAK-15";
      percentage = 15;
      title = "PEAK PHYSIOLOGICAL BIOMASS";
      desc = "Calibrated for prime athletic age. Maximizing absolute training velocity.";
    } else if (age <= 55) {
      code = "BIO-ENDURE-18";
      percentage = 18;
      title = "ENDURANCE METRIC CALIBRATION";
      desc = "Paced for high-stamina training volumes. Honoring long-term physical dedication.";
    } else {
      code = "BIO-VET-25";
      percentage = 25;
      title = "VETERAN SPEED CONTROLLER";
      desc = "Highest respect for lifelong athletes. Defying biological decay with premium gear.";
    }

    setDiscountResult({ code, percentage, title, desc });
    setIsCalibrating(false);
  };

  const handleCopyCode = () => {
    if (discountResult) {
      navigator.clipboard.writeText(discountResult.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

      {/* Bio-Age Discount Calibrator Section */}
      <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-velocity-blue/5 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="inline-block px-4 py-1 border border-velocity-blue/30 text-velocity-blue text-[10px] font-bebas tracking-[0.3em] uppercase mb-4 glass">
              Interactive Calibration
            </span>
            <h2 className="text-4xl md:text-6xl font-bebas tracking-tighter">
              BIO-AGE <span className="text-gradient">DISCOUNT MATRIX</span>
            </h2>
            <p className="text-white/45 max-w-xl mx-auto font-inter text-sm mt-3 leading-relaxed">
              Scale your athletic edge proportional to your demographic profile. Enter your age to run the genetic calibration and reveal your tailored discount code.
            </p>
          </motion.div>

          <div className="glass border border-white/10 p-8 md:p-12 max-w-2xl mx-auto relative">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-velocity-blue" />
            <div className="absolute top-0 left-0 w-[1px] h-8 bg-velocity-blue" />
            <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-velocity-lime" />
            <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-velocity-lime" />

            <AnimatePresence mode="wait">
              {/* State 1: Calibrating (Loader) */}
              {isCalibrating ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 flex flex-col items-center justify-center text-center"
                >
                  <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-t-velocity-blue border-r-velocity-lime border-b-transparent border-l-transparent"
                    />
                    <div className="absolute inset-1.5 bg-background rounded-full flex items-center justify-center">
                      <Activity size={18} className="text-velocity-blue animate-pulse" />
                    </div>
                  </div>
                  <p className="font-mono text-xs text-velocity-blue uppercase tracking-widest">
                    {calibrationTexts[calibStep]}
                  </p>
                </motion.div>
              ) : discountResult ? (
                /* State 2: Result */
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-4 text-center space-y-6"
                >
                  <div className="inline-flex items-center gap-2 text-velocity-lime font-bebas text-xs tracking-widest border border-velocity-lime/30 bg-velocity-lime/10 px-3 py-1 rounded">
                    <Sparkles size={12} /> BIOMETRIC CALIBRATION COMPLETE
                  </div>

                  <div>
                    <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
                      {discountResult.title}
                    </p>
                    <h3 className="text-5xl md:text-7xl font-bebas text-white tracking-tighter mt-1">
                      {discountResult.percentage}% OFF
                    </h3>
                    <p className="text-xs text-white/50 font-inter max-w-sm mx-auto mt-2 leading-relaxed">
                      {discountResult.desc}
                    </p>
                  </div>

                  {/* Coupon card wrapper */}
                  <div className="border border-white/10 bg-white/5 p-4 max-w-xs mx-auto flex items-center justify-between font-mono text-sm relative group">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-background rounded-r border-y border-r border-white/10" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-background rounded-l border-y border-l border-white/10" />
                    
                    <span className="text-white/80 font-bold ml-2">{discountResult.code}</span>
                    <button
                      onClick={handleCopyCode}
                      className="text-velocity-blue hover:text-white transition-colors cursor-pointer mr-2 p-1.5 hover:bg-white/5"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>

                  <p className="text-[9px] text-white/30 font-inter">
                    *Apply this code at checkout to reduce transaction totals.
                  </p>

                  <button
                    onClick={() => setDiscountResult(null)}
                    className="text-xs font-bebas tracking-widest text-white/40 hover:text-white transition-colors cursor-pointer pt-2"
                  >
                    CALIBRATE NEW METRIC
                  </button>
                </motion.div>
              ) : (
                /* State 3: Input Form */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleCalibrate}
                  className="space-y-6"
                >
                  <div className="max-w-xs mx-auto">
                    <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-2 uppercase">
                      Biological Age Reference
                    </label>
                    <input
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      placeholder="e.g. 24"
                      value={ageInput}
                      onChange={(e) => setAgeInput(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-white/5 border border-white/10 focus:border-velocity-blue/50 focus:outline-none px-4 py-3 text-center text-lg font-mono text-white transition-colors"
                    />
                    {errorMsg && (
                      <p className="text-[10px] text-red-500 font-inter mt-1.5">{errorMsg}</p>
                    )}
                  </div>

                  <div className="max-w-xs mx-auto">
                    <VelocityButton
                      type="submit"
                      variant="primary"
                      size="md"
                      className="w-full cursor-pointer"
                    >
                      Calibrate Bio-Matrix
                    </VelocityButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
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
