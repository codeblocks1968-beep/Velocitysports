"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { VelocityButton } from "@/components/ui/VelocityButton";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  variant?: "blue" | "lime";
}

const ProductCard = ({ id, name, price, image, category, variant = "blue" }: ProductCardProps) => {
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    addItem({ id, name, price, image, category });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative flex flex-col glass overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500"
    >
      {/* Category Badge */}
      <div className={cn(
        "absolute top-4 left-4 z-10 px-2 py-0.5 text-[10px] font-bebas tracking-wider uppercase",
        variant === "blue" ? "bg-velocity-blue text-black" : "bg-velocity-lime text-black"
      )}>
        {category}
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-4 right-4 z-10 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
        <button
          onClick={() => setLiked(!liked)}
          className={cn(
            "w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors",
            liked ? "bg-red-500 text-white" : "bg-black/50 text-white hover:bg-red-500"
          )}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-velocity-grey/50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Color Glow Overlay */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500",
          variant === "blue" ? "bg-velocity-blue" : "bg-velocity-lime"
        )} />
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className={cn(
            "text-xl font-bebas tracking-wide transition-colors",
            variant === "blue" ? "text-white group-hover:text-velocity-blue" : "text-white group-hover:text-velocity-lime"
          )}>
            {name}
          </h3>
          <span className="text-velocity-lime font-mono text-sm">{price}</span>
        </div>

        <p className="text-sm text-white/50 mb-6 line-clamp-2">
          Engineered for elite athletes. Pushing the boundaries of performance and innovation.
        </p>

        <div className="mt-auto">
          <VelocityButton
            id={`add-to-cart-${id}`}
            variant={variant === "blue" ? "primary" : "secondary"}
            size="sm"
            className="w-full"
            neon={false}
            onClick={handleAddToCart}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <Check size={14} />
                  <span>Added!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={14} />
                  <span>Add to Cart</span>
                </motion.div>
              )}
            </AnimatePresence>
          </VelocityButton>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={cn("absolute top-0 left-0 w-[1px] h-4", variant === "blue" ? "bg-velocity-blue" : "bg-velocity-lime")} />
        <div className={cn("absolute top-0 left-0 w-4 h-[1px]", variant === "blue" ? "bg-velocity-blue" : "bg-velocity-lime")} />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={cn("absolute bottom-0 right-0 w-[1px] h-4", variant === "blue" ? "bg-velocity-blue" : "bg-velocity-lime")} />
        <div className={cn("absolute bottom-0 right-0 w-4 h-[1px]", variant === "blue" ? "bg-velocity-blue" : "bg-velocity-lime")} />
      </div>
    </motion.div>
  );
};

export default ProductCard;
