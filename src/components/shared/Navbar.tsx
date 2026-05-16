"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ShoppingCart, Menu, X, User, Search } from "lucide-react";
import { VelocityButton } from "@/components/ui/VelocityButton";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import CartDrawer from "@/components/shared/CartDrawer";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const { totalItems, toggleCart } = useCartStore();

  // Only render cart count client-side to prevent SSR hydration mismatch
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Shop All", href: "/products" },
    { name: "Performance", href: "/category/performance" },
    { name: "Equipment", href: "/category/equipment" },
    { name: "Evolution", href: "/innovation" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "glass py-2" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bebas tracking-tighter text-white group-hover:text-velocity-blue transition-colors">
              VELOCITY
            </span>
            <span className="text-sm font-bebas text-velocity-lime">SPORTS</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bebas uppercase tracking-widest text-white/70 hover:text-velocity-blue transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-velocity-blue transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <button className="text-white/80 hover:text-velocity-blue transition-colors hidden sm:block">
            <Search size={20} />
          </button>
          <button className="text-white/80 hover:text-velocity-blue transition-colors">
            <User size={20} />
          </button>
          <button
            onClick={toggleCart}
            className="text-white/80 hover:text-velocity-blue transition-colors relative"
          >
            <ShoppingCart size={20} />
            {mounted && totalItems() > 0 && (
              <motion.span
                key={totalItems()}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-velocity-lime text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {totalItems()}
              </motion.span>
            )}
          </button>
          
          <VelocityButton variant="primary" size="sm" className="hidden lg:block">
            Get Started
          </VelocityButton>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 glass border-t border-white/10 p-6 md:hidden"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xl font-bebas tracking-wider text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <VelocityButton variant="primary" size="md" className="w-full">
              Get Started
            </VelocityButton>
          </div>
        </motion.div>
      )}
      <CartDrawer />
    </nav>
  );
};

export default Navbar;
