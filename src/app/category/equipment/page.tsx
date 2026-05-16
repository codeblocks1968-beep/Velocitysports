"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import ProductCard from "@/components/shared/ProductCard";
import { Filter, SlidersHorizontal } from "lucide-react";

const EquipmentPage = () => {
  const products = [
    {
      id: "1",
      name: "Carbon-V1 Kettlebell",
      price: "$249.00",
      image: "/images/products/kettlebell.png",
      category: "Strength",
      variant: "blue" as const,
    },
    {
      id: "2",
      name: "Smart LED Bands",
      price: "$129.00",
      image: "/images/products/resistance-bands.png",
      category: "Conditioning",
      variant: "lime" as const,
    },
    {
      id: "3",
      name: "Velocity Pro Grip",
      price: "$89.00",
      image: "/images/products/kettlebell.png", // Reuse for now
      category: "Accessories",
      variant: "blue" as const,
    }
  ];

  return (
    <main className="min-h-screen bg-background text-white">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bebas tracking-tighter mb-4">
              ELITE <span className="text-gradient">EQUIPMENT</span>
            </h1>
            <p className="text-white/50 max-w-2xl font-inter font-light">
              Precision engineered tools for maximum output. Our equipment range combines aerospace materials with biometric sensors to redefine your training limits.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[72px] z-40 glass border-y border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-sm font-bebas tracking-widest text-velocity-blue hover:text-white transition-colors">
              <Filter size={16} />
              <span>Filter By</span>
            </button>
            <div className="hidden md:flex items-center space-x-4">
              {["All", "Strength", "Conditioning", "Mobility"].map((cat) => (
                <button 
                  key={cat} 
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <button className="flex items-center space-x-2 text-sm font-bebas tracking-widest text-white/60 hover:text-white transition-colors">
            <span>Sort By</span>
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
            
            {/* Placeholder / Coming Soon Card */}
            <div className="glass border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center aspect-square group hover:border-velocity-lime/30 transition-colors">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-velocity-lime/50 transition-all">
                <span className="text-velocity-lime text-2xl font-bebas">+</span>
              </div>
              <h3 className="font-bebas tracking-widest text-white/40 mb-2">Next Gen Gear</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/20">Dropping Q3 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bebas mb-6">DON&apos;T MISS THE <span className="text-velocity-blue">NEXT DROP</span></h2>
          <p className="text-white/40 mb-10 font-inter font-light">Join the elite. Get early access to limited edition drops and experimental performance gear.</p>
          <div className="flex glass p-1">
            <input 
              type="email" 
              placeholder="ENTER EMAIL" 
              className="bg-transparent border-none focus:ring-0 flex-grow px-6 text-sm font-bebas tracking-widest"
            />
            <button className="bg-white text-black px-8 py-3 font-bebas tracking-widest hover:bg-velocity-blue transition-colors">
              SIGN UP
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EquipmentPage;
