"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Heart, Settings, LogIn, UserPlus, ChevronRight, X } from "lucide-react";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="absolute right-0 top-full mt-3 w-72 bg-[#0a0a0a] border border-white/10 shadow-2xl z-[80]"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,120,255,0.05)" }}
        >
          {/* Header */}
          <div className="p-5 border-b border-white/5 relative">
            <button onClick={onClose} className="absolute top-3 right-3 text-white/30 hover:text-white transition-colors">
              <X size={14} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-velocity-grey border border-white/10 flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-white/40" />
              </div>
              <div>
                <p className="font-bebas tracking-wide text-white">Guest User</p>
                <p className="text-[10px] text-white/30 font-inter">Sign in to access your account</p>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 flex items-center justify-center space-x-1.5 bg-velocity-blue text-black py-2 font-bebas tracking-widest text-sm hover:bg-white transition-colors">
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-1.5 border border-white/15 text-white/60 py-2 font-bebas tracking-widest text-sm hover:border-white/40 hover:text-white transition-colors">
                <UserPlus size={14} />
                <span>Register</span>
              </button>
            </div>
          </div>

          {/* Menu */}
          <div className="p-2">
            {[
              { icon: <Package size={16} />, label: "My Orders",  sub: "Track your purchases" },
              { icon: <Heart size={16} />,   label: "Wishlist",   sub: "Saved items"          },
              { icon: <Settings size={16} />,label: "Settings",   sub: "Account preferences"  },
            ].map((item) => (
              <a key={item.label} href="#" className="flex items-center justify-between px-3 py-3 hover:bg-white/5 transition-colors group">
                <div className="flex items-center space-x-3">
                  <span className="text-white/30 group-hover:text-velocity-blue transition-colors">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bebas tracking-wide text-white/70 group-hover:text-white transition-colors">{item.label}</p>
                    <p className="text-[10px] text-white/25 font-inter">{item.sub}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-white/20 group-hover:text-velocity-blue transition-colors" />
              </a>
            ))}
          </div>

          <div className="px-4 py-3 border-t border-white/5">
            <p className="text-[10px] text-white/15 font-inter text-center">Velocity Sports &mdash; Member Portal</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;
