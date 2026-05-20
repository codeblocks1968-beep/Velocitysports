"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, ShoppingBag, ShieldCheck, CheckCircle2, Award, Zap } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { VelocityButton } from "@/components/ui/VelocityButton";
import { useCartStore } from "@/store/cartStore";
import { useUserStore, Order } from "@/store/userStore";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { profile, addOrder, addXP } = useUserStore();

  // Form states initialized with profile data
  const [formData, setFormData] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
    zipCode: profile.zipCode || "",
    country: profile.country || "United States",
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [xpEarned, setXpEarned] = useState(0);

  const processingTexts = [
    "AUTHENTICATING SECURE BIOMETRIC PROTOCOLS...",
    "VERIFYING TRANSACTION CREDENTIALS...",
    "ESTABLISHING CRYPTO-SHIELDED CONNECTION...",
    "COMPLETING TRANSACTION AND ISSUING XP...",
  ];

  // Auto-fill form values when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        zipCode: profile.zipCode || "",
        country: profile.country || "United States",
      });
    }
  }, [profile]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (e.target.name === "cardNumber") {
      // Formatter for card number
      val = val.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
    } else if (e.target.name === "expiry") {
      val = val.replace(/\//g, "").replace(/(\d{2})/g, "$1/").trim();
      if (val.endsWith("/")) val = val.slice(0, -1);
      val = val.slice(0, 5);
    } else if (e.target.name === "cvv") {
      val = val.replace(/\D/g, "").slice(0, 4);
    }

    setPaymentData({ ...paymentData, [e.target.name]: val });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};

    if (!formData.name.trim()) tempErrors.name = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) tempErrors.phone = "Phone number is required";
    if (!formData.address.trim()) tempErrors.address = "Address is required";
    if (!formData.city.trim()) tempErrors.city = "City is required";
    if (!formData.zipCode.trim()) tempErrors.zipCode = "Zip/Postal Code is required";

    // Card validations
    const cleanCard = paymentData.cardNumber.replace(/\s/g, "");
    if (cleanCard.length < 13 || cleanCard.length > 19) {
      tempErrors.cardNumber = "Enter a valid card number";
    }
    if (paymentData.expiry.length !== 5) {
      tempErrors.expiry = "Use MM/YY format";
    }
    if (paymentData.cvv.length < 3) {
      tempErrors.cvv = "Invalid CVV";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setProcessStep(0);

    // Simulated multi-stage processing loader
    const interval = setInterval(() => {
      setProcessStep((prev) => {
        if (prev >= processingTexts.length - 1) {
          clearInterval(interval);
          completeCheckout();
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const completeCheckout = () => {
    const sub = totalPrice();
    const ship = sub > 150 ? 0 : 15;
    const tax = sub * 0.08; // 8% tax
    const finalTotal = sub + ship + tax;
    const orderId = `VEL-${Math.floor(1000 + Math.random() * 9000)}-${Math.random()
      .toString(36)
      .substring(2, 4)
      .toUpperCase()}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split("T")[0],
      items: [...items],
      subtotal: sub,
      total: finalTotal,
      status: "Processing",
      shippingDetails: { ...formData },
    };

    // Calculate XP: 10% of subtotal as XP points
    const earnedPoints = Math.round(sub * 0.5);

    addOrder(newOrder);
    addXP(earnedPoints);
    setXpEarned(earnedPoints);
    setOrderSuccess(newOrder);
    clearCart();
    setIsProcessing(false);
  };

  const sub = totalPrice();
  const shipping = sub === 0 ? 0 : sub > 150 ? 0 : 15;
  const tax = sub * 0.08;
  const total = sub + shipping + tax;

  return (
    <main className="min-h-screen bg-background text-white selection:bg-velocity-blue selection:text-black">
      <Navbar />

      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-velocity-blue/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-velocity-lime/5 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {/* 1. Processing Screen */}
            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-20 text-center min-h-[60vh] glass border border-white/10"
              >
                {/* Neon Spinner */}
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-t-velocity-blue border-r-velocity-lime border-b-transparent border-l-transparent"
                  />
                  <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} className="text-velocity-blue animate-pulse" />
                  </div>
                </div>

                <h3 className="font-bebas tracking-[0.2em] text-xl md:text-2xl text-white mb-2">
                  TRANSACTION IN PROGRESS
                </h3>
                <motion.p
                  key={processStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-xs text-velocity-blue max-w-md uppercase tracking-wider"
                >
                  {processingTexts[processStep]}
                </motion.p>
              </motion.div>
            )}

            {/* 2. Success Screen */}
            {!isProcessing && orderSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass border border-white/10 p-8 md:p-12 max-w-3xl mx-auto text-center"
              >
                <div className="w-20 h-20 bg-velocity-blue/10 border border-velocity-blue/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-velocity-blue" />
                </div>

                <span className="text-[10px] font-bebas tracking-[0.3em] text-velocity-blue uppercase">
                  Order Completed
                </span>
                <h2 className="text-4xl md:text-6xl font-bebas tracking-tighter mt-2 mb-4">
                  TRANSACTION SUCCESSFUL
                </h2>
                <p className="text-white/60 font-inter text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  Your biometric receipt has been logged. Elite performance gear is being calibrated and dispatched.
                </p>

                {/* Rewards Panel */}
                <div className="border border-white/15 bg-white/5 p-6 mb-8 max-w-md mx-auto relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-velocity-blue/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Award size={20} className="text-velocity-lime" />
                    <span className="font-bebas tracking-widest text-white">RECRUIT BONUS LOGGED</span>
                  </div>
                  <div className="text-2xl font-bebas text-velocity-lime">
                    +{xpEarned} <span className="text-white text-base">ATHLETE XP EARNED</span>
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 font-inter">
                    Level up your profile to unlock elite tiers, customizable avatars, and high-performance discounts.
                  </p>
                </div>

                {/* Receipt Details */}
                <div className="border border-white/10 p-6 text-left font-mono text-xs max-w-md mx-auto mb-8 space-y-2">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/40">ORDER REFERENCE</span>
                    <span className="text-white font-bold">{orderSuccess.id}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-white/40">SHIPPED TO</span>
                    <span className="text-white text-right truncate w-48">
                      {orderSuccess.shippingDetails.name}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-white/40">DATE TIME</span>
                    <span className="text-white">{orderSuccess.date}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/10 mt-3 pt-3">
                    <span className="text-white/40">GRAND TOTAL</span>
                    <span className="text-velocity-blue font-bold">
                      ${orderSuccess.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/profile?tab=orders" className="w-full sm:w-auto">
                    <VelocityButton variant="primary" size="md" className="w-full cursor-pointer">
                      View My Orders
                    </VelocityButton>
                  </Link>
                  <Link href="/products" className="w-full sm:w-auto">
                    <VelocityButton variant="outline" size="md" className="w-full cursor-pointer">
                      Continue Shopping
                    </VelocityButton>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* 3. Standard Checkout Form */}
            {!isProcessing && !orderSuccess && (
              <motion.div key="form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Column */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Go back */}
                  <Link
                    href="/products"
                    className="inline-flex items-center text-xs font-bebas tracking-widest text-white/50 hover:text-velocity-blue transition-colors gap-2 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> BACK TO COLLECTION
                  </Link>

                  <h1 className="text-4xl md:text-5xl font-bebas tracking-tighter">
                    ATHLETE <span className="text-gradient">CHECKOUT</span>
                  </h1>

                  {items.length === 0 ? (
                    <div className="glass border border-white/10 p-12 text-center">
                      <ShoppingBag size={48} className="text-white/10 mx-auto mb-4" />
                      <h3 className="font-bebas tracking-widest text-xl mb-2 text-white/60">
                        YOUR CART IS EMPTY
                      </h3>
                      <p className="text-sm text-white/35 mb-6">
                        No elite items found in your checkout terminal.
                      </p>
                      <Link href="/products">
                        <VelocityButton variant="primary" size="md" className="cursor-pointer">
                          Browse collection
                        </VelocityButton>
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handlePlaceOrder} className="space-y-6">
                      {/* Shipping Section */}
                      <div className="glass border border-white/10 p-6 md:p-8 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-velocity-blue rounded-full" />
                          <h3 className="font-bebas tracking-widest text-lg text-white">
                            1. SHIPPING LOGISTICS
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleFormChange}
                              className={`w-full bg-white/5 border ${
                                errors.name ? "border-red-500" : "border-white/10"
                              } focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors`}
                            />
                            {errors.name && (
                              <p className="text-[10px] text-red-500 font-inter mt-1">
                                {errors.name}
                              </p>
                            )}
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
                              className={`w-full bg-white/5 border ${
                                errors.email ? "border-red-500" : "border-white/10"
                              } focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors`}
                            />
                            {errors.email && (
                              <p className="text-[10px] text-red-500 font-inter mt-1">
                                {errors.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            placeholder="+1 (555) 000-0000"
                            className={`w-full bg-white/5 border ${
                              errors.phone ? "border-red-500" : "border-white/10"
                            } focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors`}
                          />
                          {errors.phone && (
                            <p className="text-[10px] text-red-500 font-inter mt-1">
                              {errors.phone}
                            </p>
                          )}
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
                            className={`w-full bg-white/5 border ${
                              errors.address ? "border-red-500" : "border-white/10"
                            } focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors`}
                          />
                          {errors.address && (
                            <p className="text-[10px] text-red-500 font-inter mt-1">
                              {errors.address}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleFormChange}
                              className={`w-full bg-white/5 border ${
                                errors.city ? "border-red-500" : "border-white/10"
                              } focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors`}
                            />
                            {errors.city && (
                              <p className="text-[10px] text-red-500 font-inter mt-1">
                                {errors.city}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleFormChange}
                              className={`w-full bg-white/5 border ${
                                errors.zipCode ? "border-red-500" : "border-white/10"
                              } focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white transition-colors`}
                            />
                            {errors.zipCode && (
                              <p className="text-[10px] text-red-500 font-inter mt-1">
                                {errors.zipCode}
                              </p>
                            )}
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                              Country
                            </label>
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleFormChange}
                              className="w-full bg-[#0a0a0a] border border-white/10 focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-inter text-white cursor-pointer"
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Germany">Germany</option>
                              <option value="India">India</option>
                              <option value="Japan">Japan</option>
                              <option value="Australia">Australia</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Payment Section */}
                      <div className="glass border border-white/10 p-6 md:p-8 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-velocity-lime rounded-full" />
                            <h3 className="font-bebas tracking-widest text-lg text-white">
                              2. SECURE TERMINAL PAYMENT
                            </h3>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/40 font-mono text-[9px]">
                            <ShieldCheck size={12} className="text-velocity-blue" />
                            <span>SSL ENCRYPTED</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                            Card Number
                          </label>
                          <div className="relative">
                            <CreditCard
                              size={16}
                              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                            />
                            <input
                              type="text"
                              name="cardNumber"
                              value={paymentData.cardNumber}
                              onChange={handlePaymentChange}
                              placeholder="0000 0000 0000 0000"
                              className={`w-full bg-white/5 border ${
                                errors.cardNumber ? "border-red-500" : "border-white/10"
                              } focus:border-velocity-blue/50 focus:outline-none pl-10 pr-4 py-2.5 text-sm font-mono text-white placeholder:text-white/20 transition-colors`}
                            />
                          </div>
                          {errors.cardNumber && (
                            <p className="text-[10px] text-red-500 font-inter mt-1">
                              {errors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              name="expiry"
                              value={paymentData.expiry}
                              onChange={handlePaymentChange}
                              placeholder="MM/YY"
                              className={`w-full bg-white/5 border ${
                                errors.expiry ? "border-red-500" : "border-white/10"
                              } focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-mono text-white placeholder:text-white/20 transition-colors`}
                            />
                            {errors.expiry && (
                              <p className="text-[10px] text-red-500 font-inter mt-1">
                                {errors.expiry}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] font-bebas tracking-wider text-white/40 mb-1.5 uppercase">
                              CVV / Security Code
                            </label>
                            <input
                              type="password"
                              name="cvv"
                              value={paymentData.cvv}
                              onChange={handlePaymentChange}
                              placeholder="•••"
                              className={`w-full bg-white/5 border ${
                                errors.cvv ? "border-red-500" : "border-white/10"
                              } focus:border-velocity-blue/50 focus:outline-none px-4 py-2.5 text-sm font-mono text-white placeholder:text-white/20 transition-colors`}
                            />
                            {errors.cvv && (
                              <p className="text-[10px] text-red-500 font-inter mt-1">
                                {errors.cvv}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Confirm Button */}
                      <VelocityButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full text-lg cursor-pointer"
                      >
                        Confirm Transaction & Place Order
                      </VelocityButton>
                    </form>
                  )}
                </div>

                {/* Sidebar Summary */}
                {items.length > 0 && (
                  <div className="lg:col-span-5 glass border border-white/10 p-6 md:p-8 space-y-6">
                    <h3 className="font-bebas tracking-widest text-lg text-white border-b border-white/10 pb-4">
                      TRANSACTION BASKET
                    </h3>

                    {/* Basket items */}
                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-hide">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="relative w-16 h-16 bg-velocity-grey flex-shrink-0 border border-white/10 overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bebas text-sm text-white tracking-wide truncate">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-mono text-xs text-velocity-lime">
                            {item.price}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Breakdown */}
                    <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-bebas tracking-wider text-white/50">SUBTOTAL</span>
                        <span className="font-mono text-white">${sub.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bebas tracking-wider text-white/50">SHIPPING</span>
                        <span className="font-mono text-white">
                          {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bebas tracking-wider text-white/50">TAX (8%)</span>
                        <span className="font-mono text-white">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bebas border-t border-white/10 pt-3 mt-1">
                        <span className="text-white">GRAND TOTAL</span>
                        <span className="text-velocity-blue font-bold text-lg">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Bio rewards hint */}
                    <div className="border border-velocity-blue/20 bg-velocity-blue/5 p-4 flex gap-3 items-start">
                      <Zap size={18} className="text-velocity-blue flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bebas text-white tracking-wide">
                          XP BONUS ACCELERATOR
                        </p>
                        <p className="text-[10px] text-white/50 font-inter leading-relaxed mt-1">
                          Placing this order logs approximately +{Math.round(sub * 0.5)} points to
                          your Velocity Athlete Level. Keep training to unlock premium status.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
