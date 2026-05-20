"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Search, X } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import ProductCard from "@/components/shared/ProductCard";

type Category = "All" | "Football" | "Cricket" | "Basketball" | "Tennis" | "Gym" | "Badminton" | "Hockey" | "Volleyball";
type SortOption = "featured" | "price-asc" | "price-desc" | "name";

const ALL_PRODUCTS = [
  { id: "1",  name: "Pro Elite Match Football",      price: "$89.00",   image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80", category: "Football",   variant: "blue" as const, featured: true  },
  { id: "2",  name: "GripMax Goalkeeper Gloves",     price: "$74.00",   image: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&q=80", category: "Football",   variant: "lime" as const, featured: false },
  { id: "3",  name: "Velocity X Football Cleats",    price: "$219.00",  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", category: "Football",   variant: "blue" as const, featured: true  },
  { id: "4",  name: "PowerStrike Willow Bat",        price: "$179.00",  image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80", category: "Cricket",    variant: "lime" as const, featured: true  },
  { id: "5",  name: "Titan Pro Cricket Helmet",      price: "$129.00",  image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=600&q=80", category: "Cricket",    variant: "blue" as const, featured: false },
  { id: "6",  name: "Champion XL Cricket Kit Bag",   price: "$149.00",  image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80", category: "Cricket",    variant: "lime" as const, featured: false },
  { id: "7",  name: "StreetPro Basketball",          price: "$99.00",   image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&q=80", category: "Basketball", variant: "blue" as const, featured: true  },
  { id: "8",  name: "AirDunk Pro Sneakers",          price: "$259.00",  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", category: "Basketball", variant: "lime" as const, featured: true  },
  { id: "9",  name: "SlamMaster Basketball Hoop",    price: "$349.00",  image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80", category: "Basketball", variant: "blue" as const, featured: false },
  { id: "10", name: "AeroSpin Tennis Racket",        price: "$139.00",  image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=600&q=80", category: "Tennis",     variant: "lime" as const, featured: true  },
  { id: "11", name: "Grand Slam Tennis Balls",       price: "$29.00",   image: "https://images.unsplash.com/photo-1592170551490-988769bc9e25?w=600&q=80", category: "Tennis",     variant: "blue" as const, featured: false },
  { id: "12", name: "IronFlex Adjustable Dumbbells", price: "$299.00",  image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80", category: "Gym",        variant: "blue" as const, featured: true  },
  { id: "13", name: "RunX Smart Treadmill",          price: "$1,299.00",image: "https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600&q=80", category: "Gym",        variant: "lime" as const, featured: true  },
  { id: "14", name: "ZenFlow Yoga Mat",              price: "$69.00",   image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80", category: "Gym",        variant: "blue" as const, featured: false },
  { id: "15", name: "AeroSwift Badminton Racket",    price: "$119.00",  image: "https://images.unsplash.com/photo-1593766788306-28561dc934b5?w=600&q=80", category: "Badminton",  variant: "lime" as const, featured: false },
  { id: "16", name: "Turbo Feather Shuttlecock Set", price: "$24.00",   image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=600&q=80", category: "Badminton",  variant: "blue" as const, featured: false },
  { id: "17", name: "IceForce Hockey Stick",         price: "$189.00",  image: "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=600&q=80", category: "Hockey",     variant: "lime" as const, featured: true  },
  { id: "18", name: "FrostGuard Hockey Helmet",      price: "$229.00",  image: "https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=600&q=80", category: "Hockey",     variant: "blue" as const, featured: false },
  { id: "19", name: "SpikePro Volleyball",           price: "$79.00",   image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80", category: "Volleyball", variant: "lime" as const, featured: false },
  { id: "20", name: "BeachMaster Volleyball Net",    price: "$159.00",  image: "https://images.unsplash.com/photo-1597524678053-5cf561a4cb6e?w=600&q=80", category: "Volleyball", variant: "blue" as const, featured: false },
];

const CATEGORIES: Category[] = ["All", "Football", "Cricket", "Basketball", "Tennis", "Gym", "Badminton", "Hockey", "Volleyball"];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name A-Z", value: "name" },
];

export default function ShopAllPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, "")) - parseFloat(b.price.replace(/[^0-9.]/g, "")));
        break;
      case "price-desc":
        result.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, "")) - parseFloat(a.price.replace(/[^0-9.]/g, "")));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [activeCategory, sortBy, searchQuery]);

  return (
    <main className="min-h-screen bg-background text-white selection:bg-velocity-blue selection:text-black">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-velocity-blue/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-velocity-lime/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 border border-velocity-blue/30 text-velocity-blue text-[10px] font-bebas tracking-[0.3em] uppercase mb-6 glass">
              Full Catalogue
            </span>
            <h1 className="text-5xl md:text-8xl font-bebas tracking-tighter mb-4 leading-none">
              SHOP <span className="text-gradient">ALL</span>
            </h1>
            <p className="text-white/50 max-w-xl font-inter font-light">
              The complete Velocity arsenal. Every tool, every edge — engineered for champions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Controls */}
      <section className="sticky top-[72px] z-40 glass border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-shrink-0 w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-velocity-blue/50 focus:outline-none pl-9 pr-8 py-2 text-sm font-inter text-white placeholder:text-white/20 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-1.5 text-[10px] font-bebas tracking-widest uppercase transition-all ${
                    activeCategory === cat
                      ? "bg-velocity-blue text-black"
                      : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <SlidersHorizontal size={14} className="text-white/40" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent border-none focus:outline-none text-[10px] font-bebas tracking-widest uppercase text-white/60 hover:text-white cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0a0a0a] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-2">
        <p className="text-[10px] font-bebas tracking-widest text-white/30 uppercase">
          Showing {filtered.length} of {ALL_PRODUCTS.length} products
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>
      </div>

      {/* Product Grid */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-bebas tracking-widest text-white/40 text-2xl mb-2">NO RESULTS FOUND</h3>
              <p className="text-white/20 text-sm mb-6">Try adjusting your search or filter.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="text-velocity-blue font-bebas tracking-widest text-sm hover:text-white transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 border-t border-white/5 mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bebas mb-4">
            CAN&apos;T FIND WHAT YOU NEED?
          </h2>
          <p className="text-white/40 mb-8 font-inter text-sm">
            Reach out to our performance consultants and we&apos;ll build something custom for your training goals.
          </p>
          <button className="border border-velocity-blue text-velocity-blue px-12 py-3 font-bebas tracking-widest hover:bg-velocity-blue hover:text-black transition-all">
            Contact Our Team
          </button>
        </div>
      </section>
    </main>
  );
}
