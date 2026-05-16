"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const ALL_PRODUCTS = [
  { id: "1",  name: "Carbon-V1 Kettlebell",        category: "Strength",      href: "/category/equipment",   price: "$249.00" },
  { id: "2",  name: "Smart LED Resistance Bands",   category: "Conditioning",  href: "/category/equipment",   price: "$129.00" },
  { id: "3",  name: "Velocity Pro Grip Gloves",     category: "Accessories",   href: "/products",             price: "$89.00"  },
  { id: "4",  name: "Hyper-Flex Foam Roller",       category: "Recovery",      href: "/products",             price: "$64.00"  },
  { id: "5",  name: "Titan Pull-Up System",         category: "Strength",      href: "/category/equipment",   price: "$349.00" },
  { id: "p1", name: "HyperStride Pro Shoes",        category: "Footwear",      href: "/category/performance", price: "$299.00" },
  { id: "p2", name: "AeroSkin Compression Suit",    category: "Apparel",       href: "/category/performance", price: "$189.00" },
  { id: "p3", name: "Sprint Parachute Harness",     category: "Speed Training",href: "/category/performance", price: "$119.00" },
  { id: "p4", name: "Reactive Agility Ladder",      category: "Agility",       href: "/category/performance", price: "$79.00"  },
  { id: "p5", name: "NeuroBand Wrist Sensor",       category: "Wearables",     href: "/category/performance", price: "$229.00" },
];

const QUICK_LINKS = [
  { label: "Shop All",    href: "/products" },
  { label: "Performance", href: "/category/performance" },
  { label: "Equipment",   href: "/category/equipment" },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = query.trim().length > 1
    ? ALL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Keyboard: Escape to close, Ctrl+K to open (handled in parent)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
          />

          {/* Panel */}
          <motion.div
            key="search-panel"
            initial={{ opacity: 0, y: -40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[90] p-6 md:p-10"
          >
            <div className="max-w-3xl mx-auto">
              {/* Search Input */}
              <div className="flex items-center space-x-4 border-b-2 border-velocity-blue pb-4">
                <Search size={24} className="text-velocity-blue flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="flex-1 bg-transparent text-2xl md:text-3xl font-bebas tracking-wide text-white placeholder:text-white/20 focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center glass hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              {/* Results or Quick Links */}
              <div className="mt-6">
                {query.trim().length > 1 ? (
                  <>
                    <p className="text-[10px] font-bebas tracking-[0.3em] text-white/30 mb-4 uppercase">
                      {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
                    </p>
                    {results.length > 0 ? (
                      <div className="space-y-2">
                        {results.map((product, i) => (
                          <motion.button
                            key={product.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => handleNavigate(product.href)}
                            className="w-full flex items-center justify-between glass p-4 hover:border-velocity-blue/40 hover:bg-white/5 transition-all group text-left"
                          >
                            <div className="flex items-center space-x-4">
                              <Zap size={16} className="text-velocity-blue flex-shrink-0" />
                              <div>
                                <p className="font-bebas tracking-wide text-white group-hover:text-velocity-blue transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                                  {product.category}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono text-velocity-lime text-sm">{product.price}</span>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/30 font-inter text-sm">
                        No products found. Try a different search term.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-bebas tracking-[0.3em] text-white/30 mb-4 uppercase">Quick Links</p>
                    <div className="flex flex-wrap gap-3">
                      {QUICK_LINKS.map((link) => (
                        <button
                          key={link.label}
                          onClick={() => handleNavigate(link.href)}
                          className="flex items-center space-x-2 px-4 py-2 glass border border-white/10 hover:border-velocity-blue/50 hover:text-velocity-blue font-bebas tracking-widest text-sm text-white/60 transition-all"
                        >
                          <span>{link.label}</span>
                          <ArrowRight size={12} />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Hint */}
              <p className="mt-8 text-[10px] text-white/20 font-inter">
                Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">ESC</kbd> to close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
