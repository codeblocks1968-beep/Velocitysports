"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Package,
  Heart,
  Settings,
  ShieldCheck,
  TrendingUp,
  Flame,
  Award,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
  Save,
  CheckCircle,
  Clock,
  MapPin,
  Trash2
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { VelocityButton } from "@/components/ui/VelocityButton";
import { useUserStore, Order, WishlistItem } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";

// Pre-defined avatars to choose from
const AVATAR_OPTIONS = [
  { id: "avatar1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80", label: "Apex Runner" },
  { id: "avatar2", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80", label: "Elite Striker" },
  { id: "avatar3", url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80", label: "Power Lifter" },
  { id: "avatar4", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80", label: "Zen Yogi" },
];

function ProfileContent() {
  const { profile, orders, wishlist, updateProfile, toggleWishlist } = useUserStore();
  const { addItem, openCart } = useCartStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active tab state
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "wishlist" | "settings">("dashboard");

  // Settings form states
  const [formData, setFormData] = useState({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || "");

  // Expandable orders helper
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Sync tab with query parameters
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "orders" || tabParam === "wishlist" || tabParam === "settings") {
      setActiveTab(tabParam);
    } else {
      setActiveTab("dashboard");
    }
  }, [searchParams]);

  const handleTabChange = (tab: "dashboard" | "orders" | "wishlist" | "settings") => {
    setActiveTab(tab);
    router.push(`/profile?tab=${tab}`, { scroll: false });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      avatar: selectedAvatar,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    openCart();
  };

  // XP calculation
  const xpInCurrentLevel = profile.xp % 1000;
  const xpProgressPercent = (xpInCurrentLevel / 1000) * 100;

  return (
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      {/* Profile Header Header */}
      <section className="pt-32 pb-8">
        <div className="glass border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-velocity-blue/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Profile Avatar */}
            <div className="relative w-24 h-24 rounded-full border-2 border-velocity-blue bg-velocity-grey overflow-hidden flex-shrink-0">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-velocity-grey text-white/30">
                  <User size={40} />
                </div>
              )}
            </div>

            {/* Profile Text */}
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1.5">
                <h1 className="text-3xl md:text-4xl font-bebas tracking-wide text-white">
                  {profile.name}
                </h1>
                <span className="bg-velocity-blue/10 text-velocity-blue border border-velocity-blue/30 px-2 py-0.5 text-xs font-bebas tracking-wider uppercase">
                  {profile.tier}
                </span>
              </div>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-3">
                LEVEL {profile.level} ATHLETE &bull; JOINED {profile.joinedDate}
              </p>

              {/* Progress bar */}
              <div className="w-64 md:w-80">
                <div className="flex justify-between font-mono text-[9px] text-white/50 mb-1">
                  <span>LEVEL {profile.level}</span>
                  <span>{profile.xp} XP TOTAL</span>
                  <span>LEVEL {profile.level + 1}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-velocity-blue to-velocity-lime shadow-[0_0_8px_rgba(0,242,255,0.5)]"
                  />
                </div>
                <p className="text-[9px] text-velocity-lime font-mono mt-1 text-right">
                  {1000 - xpInCurrentLevel} XP UNTIL LEVEL UP
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center md:text-right flex-shrink-0">
            <div className="glass border border-white/5 p-4 min-w-[120px]">
              <p className="text-[10px] font-bebas text-white/30 tracking-widest uppercase">ORDER LOGS</p>
              <p className="text-2xl font-bebas text-white mt-1">{orders.length}</p>
            </div>
            <div className="glass border border-white/5 p-4 min-w-[120px]">
              <p className="text-[10px] font-bebas text-white/30 tracking-widest uppercase">WISHLIST</p>
              <p className="text-2xl font-bebas text-white mt-1">{wishlist.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Switcher */}
      <section className="mb-8 border-b border-white/10">
        <div className="flex overflow-x-auto space-x-8 scrollbar-hide">
          {[
            { id: "dashboard", label: "DASHBOARD", icon: <TrendingUp size={16} /> },
            { id: "orders", label: "MY ORDERS", icon: <Package size={16} /> },
            { id: "wishlist", label: "WISHLIST", icon: <Heart size={16} /> },
            { id: "settings", label: "SETTINGS", icon: <Settings size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-bebas tracking-wider text-sm transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-velocity-blue text-velocity-blue"
                  : "border-transparent text-white/45 hover:text-white"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic Tabs Content */}
      <section className="pb-24 min-h-[40vh]">
        <AnimatePresence mode="wait">
          {/* TAB 1: Dashboard */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Performance Cards */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="font-bebas tracking-widest text-xl mb-2 text-white">
                  PERFORMANCE RATINGS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "TRAINING CONSTANCY", val: "5.8 hrs / wk", change: "+12% vs last month", icon: <Clock className="text-velocity-blue" /> },
                    { label: "VELOCITY COEFFICIENT", val: "88.4 / 100", change: "Top 4.2% of athletes", icon: <Flame className="text-velocity-lime" /> },
                    { label: "BIOMETRIC SYNC RATE", val: "99.8%", change: "Secure SSL link active", icon: <ShieldCheck className="text-velocity-blue" /> },
                    { label: "GLOBAL STANDING", val: "#482", change: "Elite Athlete tier rank", icon: <Award className="text-velocity-lime" /> },
                  ].map((stat, i) => (
                    <div key={i} className="glass p-5 border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white/2 rounded-full translate-x-4 -translate-y-4 group-hover:scale-125 transition-transform" />
                      <div className="flex items-center gap-3 mb-3">
                        {stat.icon}
                        <span className="text-[10px] font-bebas text-white/40 tracking-wider uppercase">
                          {stat.label}
                        </span>
                      </div>
                      <p className="text-2xl font-bebas text-white">{stat.val}</p>
                      <p className="text-[10px] text-white/30 font-inter mt-1.5">{stat.change}</p>
                    </div>
                  ))}
                </div>

                {/* Level Tier Details */}
                <div className="glass border border-white/10 p-6 relative overflow-hidden">
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-velocity-blue/10 to-transparent pointer-events-none" />
                  <h4 className="font-bebas text-white text-lg tracking-wider mb-2">
                    ATHLETIC TIER PRIVILEGES: {profile.tier}
                  </h4>
                  <p className="text-xs text-white/50 font-inter leading-relaxed mb-4">
                    As a verified {profile.tier} athlete, your biometrics and order logs are routed through
                    priority calibration. You are eligible for custom apparel fittings and early drop access.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-velocity-blue">
                      <CheckCircle size={14} /> FREE EXPRESS SHIPPING (&gt;$150)
                    </div>
                    <div className="flex items-center gap-1.5 text-velocity-lime">
                      <CheckCircle size={14} /> 5% COMPATIBILITY CASHBACK
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Profile Summary */}
              <div className="space-y-6">
                <h3 className="font-bebas tracking-widest text-xl mb-2 text-white">
                  LOGISTICS DESTINATION
                </h3>
                <div className="glass border border-white/10 p-6 space-y-4 font-inter text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-velocity-blue flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-white mb-0.5">{profile.name}</p>
                      <p className="text-white/60 text-xs leading-relaxed">
                        {profile.address}<br />
                        {profile.city}, {profile.zipCode}<br />
                        {profile.country}
                      </p>
                      <p className="text-[10px] text-white/30 font-mono mt-2">{profile.phone}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-4">
                    <button
                      onClick={() => handleTabChange("settings")}
                      className="text-xs font-bebas tracking-wider text-velocity-blue hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      UPDATE ADDRESS <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                <div className="glass border border-white/5 p-6 space-y-4">
                  <h4 className="font-bebas tracking-wider text-white">VELOCITY ECOSYSTEM</h4>
                  <p className="text-xs text-white/40 leading-relaxed font-inter">
                    Connect smart biometrics or configure smart equipment profiles via the combat system.
                  </p>
                  <Link href="/fight">
                    <VelocityButton variant="outline" size="sm" className="w-full text-xs cursor-pointer">
                      Enter Fighting Arena
                    </VelocityButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Orders */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              <h3 className="font-bebas tracking-widest text-xl mb-2 text-white">
                YOUR TRANSACTION LOGS ({orders.length})
              </h3>

              {orders.length === 0 ? (
                <div className="glass border border-white/10 p-12 text-center">
                  <Package size={48} className="text-white/10 mx-auto mb-4" />
                  <p className="font-bebas tracking-widest text-white/40 text-xl">NO ACTIVE ORDERS LOGGED</p>
                  <p className="text-white/20 text-xs font-inter mt-1 mb-6">
                    Gear up and complete checkout to sync transaction files.
                  </p>
                  <Link href="/products">
                    <VelocityButton variant="primary" size="md" className="cursor-pointer">
                      Shop Gear
                    </VelocityButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="glass border border-white/10 p-6 flex flex-col gap-4 transition-all duration-300 hover:border-white/20"
                    >
                      {/* Order info bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-velocity-blue">
                            {order.id}
                          </span>
                          <span className="text-[10px] font-mono text-white/30">{order.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bebas text-white/60">
                            TOTAL: <span className="font-mono text-velocity-lime font-bold">${order.total.toFixed(2)}</span>
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-mono border rounded ${
                              order.status === "Delivered"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : order.status === "Processing"
                                ? "bg-velocity-blue/10 text-velocity-blue border-velocity-blue/20"
                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Order items list */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                              <div className="relative w-12 h-12 bg-velocity-grey border border-white/5 overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bebas text-sm text-white tracking-wide truncate">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                                  Qty: {item.quantity} &bull; {item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Expand details button */}
                        <div className="flex flex-col justify-between items-start md:items-end">
                          <button
                            onClick={() =>
                              setExpandedOrder(expandedOrder === order.id ? null : order.id)
                            }
                            className="text-xs font-bebas tracking-wider text-white/40 hover:text-velocity-blue transition-colors flex items-center gap-1.5 cursor-pointer mt-2 md:mt-0"
                          >
                            {expandedOrder === order.id ? "HIDE SHIPMENT TERMINAL" : "VIEW SHIPMENT TERMINAL"}{" "}
                            <ChevronRight
                              size={12}
                              className={`transform transition-transform ${
                                expandedOrder === order.id ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expandable Shipment terminal */}
                      {expandedOrder === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-white/5 pt-4 mt-2 font-mono text-[11px] text-white/50 grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <div>
                            <p className="text-white/30 uppercase tracking-wider text-[9px] mb-1 font-bebas">
                              DELIVERY TARGET
                            </p>
                            <p className="text-white font-bold">{order.shippingDetails.name}</p>
                            <p>{order.shippingDetails.address}</p>
                            <p>
                              {order.shippingDetails.city}, {order.shippingDetails.zipCode}
                            </p>
                            <p>{order.shippingDetails.country}</p>
                          </div>
                          <div>
                            <p className="text-white/30 uppercase tracking-wider text-[9px] mb-1 font-bebas">
                              BILLING DETAILS
                            </p>
                            <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
                            <p>Est. Tax: ${(order.total - order.subtotal - (order.subtotal > 150 ? 0 : 15)).toFixed(2)}</p>
                            <p>Shipping: {order.subtotal > 150 ? "FREE" : "$15.00"}</p>
                            <p className="text-velocity-blue font-bold mt-1">
                              Payment Authenticated: SSL Secure
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: Wishlist */}
          {activeTab === "wishlist" && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <h3 className="font-bebas tracking-widest text-xl mb-4 text-white">
                SAVED PERFORMANCE PIECES ({wishlist.length})
              </h3>

              {wishlist.length === 0 ? (
                <div className="glass border border-white/10 p-12 text-center max-w-lg mx-auto">
                  <Heart size={48} className="text-white/10 mx-auto mb-4" />
                  <p className="font-bebas tracking-widest text-white/40 text-xl">WISHLIST IS EMPTY</p>
                  <p className="text-white/20 text-xs font-inter mt-1 mb-6">
                    Add custom items by clicking the heart button on product catalogs.
                  </p>
                  <Link href="/products">
                    <VelocityButton variant="primary" size="md" className="cursor-pointer">
                      Browse Gear
                    </VelocityButton>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="glass border border-white/5 p-4 flex flex-col group relative hover:border-white/20 transition-all duration-300"
                    >
                      {/* Image container */}
                      <div className="relative aspect-square bg-velocity-grey/50 mb-4 overflow-hidden border border-white/5">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105 duration-500"
                        />
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white/40 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Info */}
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">
                        {item.category}
                      </p>
                      <h4 className="font-bebas text-lg text-white tracking-wide truncate group-hover:text-velocity-blue transition-colors mt-0.5">
                        {item.name}
                      </h4>
                      <p className="text-velocity-lime font-mono text-sm mt-1 mb-4">
                        {item.price}
                      </p>

                      <VelocityButton
                        onClick={() => handleAddToCart(item)}
                        variant="primary"
                        size="sm"
                        className="w-full mt-auto text-xs cursor-pointer"
                      >
                        Add to Cart
                      </VelocityButton>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Settings */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto"
            >
              <h3 className="font-bebas tracking-widest text-xl mb-4 text-white">
                ATHLETE PREFERENCES
              </h3>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Avatar picker */}
                <div className="glass border border-white/10 p-6 space-y-4">
                  <label className="block text-[10px] font-bebas tracking-wider text-white/40 uppercase">
                    Select Avatar Badge
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {AVATAR_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setSelectedAvatar(opt.url)}
                        className={`relative w-16 h-16 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                          selectedAvatar === opt.url
                            ? "border-velocity-blue scale-105 shadow-[0_0_8px_rgba(0,242,255,0.4)]"
                            : "border-white/10 hover:border-white/35"
                        }`}
                      >
                        <Image src={opt.url} alt={opt.label} fill className="object-cover" />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedAvatar("")}
                      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bebas text-xs cursor-pointer transition-all ${
                        selectedAvatar === ""
                          ? "border-velocity-blue text-velocity-blue"
                          : "border-white/10 text-white/40 hover:border-white/30"
                      }`}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Profile Form fields */}
                <div className="glass border border-white/10 p-6 md:p-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                        Display Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full bg-white/5 border border-white/10 focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full bg-white/5 border border-white/10 focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full bg-white/5 border border-white/10 focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        className="w-full bg-white/5 border border-white/10 focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleFormChange}
                        className="w-full bg-white/5 border border-white/10 focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleFormChange}
                        className="w-full bg-white/5 border border-white/10 focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleFormChange}
                        className="w-full bg-white/5 border border-white/10 focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <AnimatePresence>
                    {saveSuccess && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-mono text-velocity-lime flex items-center gap-1.5"
                      >
                        <CheckCircle size={14} /> ATHLETE PROTOCOL SYNCHRONIZED
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <VelocityButton
                    type="submit"
                    variant="primary"
                    size="md"
                    className="ml-auto cursor-pointer flex items-center gap-2"
                  >
                    <Save size={16} /> Save Changes
                  </VelocityButton>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background text-white selection:bg-velocity-blue selection:text-black pb-12">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-t-velocity-blue border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
            <p className="font-bebas tracking-widest text-white/40 text-xl">LOADING DASHBOARD FILES...</p>
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </main>
  );
}
