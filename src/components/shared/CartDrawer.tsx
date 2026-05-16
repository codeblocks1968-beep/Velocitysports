"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { VelocityButton } from "@/components/ui/VelocityButton";

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-[70] flex flex-col bg-[#0a0a0a] border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <ShoppingBag size={20} className="text-velocity-blue" />
                <h2 className="text-xl font-bebas tracking-widest">
                  CART{" "}
                  <span className="text-velocity-blue">
                    ({totalItems()})
                  </span>
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-white/10 mb-4" />
                  <p className="font-bebas tracking-widest text-white/30 text-xl">
                    YOUR CART IS EMPTY
                  </p>
                  <p className="text-white/20 text-sm mt-2">
                    Add some elite gear to get started.
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="flex space-x-4 glass p-4"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 bg-velocity-grey overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bebas tracking-wide text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-velocity-lime font-mono text-sm">
                          {item.price}
                        </p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">
                          {item.category}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3 mt-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 flex items-center justify-center border border-white/20 hover:border-velocity-blue hover:text-velocity-blue transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-mono text-sm w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 flex items-center justify-center border border-white/20 hover:border-velocity-blue hover:text-velocity-blue transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/20 hover:text-red-400 transition-colors self-start"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-bebas tracking-widest text-white/50">
                    SUBTOTAL
                  </span>
                  <span className="font-mono text-white">
                    ${totalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bebas tracking-wide">
                  <span className="text-white text-xl">TOTAL</span>
                  <span className="text-velocity-blue text-xl">
                    ${totalPrice().toFixed(2)}
                  </span>
                </div>
                <VelocityButton variant="primary" size="lg" className="w-full">
                  Checkout
                </VelocityButton>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs font-bebas tracking-widest text-white/30 hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
