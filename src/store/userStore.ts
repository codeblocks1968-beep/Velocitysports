import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "./cartStore";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  avatar: string;
  tier: string;
  xp: number;
  level: number;
  joinedDate: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

export interface WishlistItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface UserStore {
  profile: UserProfile;
  orders: Order[];
  wishlist: WishlistItem[];
  updateProfile: (profile: Partial<UserProfile>) => void;
  addOrder: (order: Order) => void;
  toggleWishlist: (item: WishlistItem) => void;
  inWishlist: (id: string) => boolean;
  addXP: (amount: number) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Guest Athlete",
  email: "athlete@velocity.sports",
  phone: "+1 (555) 987-6543",
  address: "100 Speed Tech Blvd",
  city: "Aero Valley",
  zipCode: "90210",
  country: "United States",
  avatar: "",
  tier: "PRO ELITE",
  xp: 1500,
  level: 12,
  joinedDate: "May 2026",
};

const MOCK_INITIAL_ORDERS: Order[] = [
  {
    id: "VEL-8921-X",
    date: "2026-05-10",
    items: [
      {
        id: "3",
        name: "Velocity X Football Cleats",
        price: "$219.00",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
        category: "Football",
        quantity: 1,
      },
    ],
    subtotal: 219.0,
    total: 234.0, // including mock tax & shipping
    status: "Delivered",
    shippingDetails: {
      name: "Guest Athlete",
      email: "athlete@velocity.sports",
      phone: "+1 (555) 987-6543",
      address: "100 Speed Tech Blvd",
      city: "Aero Valley",
      zipCode: "90210",
      country: "United States",
    },
  },
];

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      orders: MOCK_INITIAL_ORDERS,
      wishlist: [],

      updateProfile: (updated) =>
        set((state) => ({
          profile: { ...state.profile, ...updated },
        })),

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      toggleWishlist: (item) =>
        set((state) => {
          const exists = state.wishlist.some((i) => i.id === item.id);
          if (exists) {
            return { wishlist: state.wishlist.filter((i) => i.id !== item.id) };
          } else {
            return { wishlist: [...state.wishlist, item] };
          }
        }),

      inWishlist: (id) => {
        return get().wishlist.some((i) => i.id === id);
      },

      addXP: (amount) =>
        set((state) => {
          const newXP = state.profile.xp + amount;
          const newLevel = Math.floor(newXP / 1000) + 1; // 1000 XP per level
          let newTier = state.profile.tier;
          if (newLevel >= 15) newTier = "APEX CHAMPION";
          else if (newLevel >= 10) newTier = "PRO ELITE";
          else if (newLevel >= 5) newTier = "CHALLENGER";
          else newTier = "RECRUIT";

          return {
            profile: {
              ...state.profile,
              xp: newXP,
              level: newLevel,
              tier: newTier,
            },
          };
        }),
    }),
    { name: "velocity-user" }
  )
);
