import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

const STORAGE_KEY = "verodav.cart.v1";
const listeners = new Set<() => void>();
let items: CartItem[] = load();

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

// Cross-tab sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      items = load();
      listeners.forEach((l) => l());
    }
  });
}

const getSnapshot = () => items;
const getServerSnapshot = () => [] as CartItem[];

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartCornt() {
  const c = useCart();
  return c.reduce((n, i) => n + i.qty, 0);
}

export const cart = {
  add(item: Omit<CartItem, "qty">, qty = 1) {
    const existing = items.find((i) => i.id === item.id);
    if (existing) {
      items = items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
    } else {
      items = [...items, { ...item, qty }];
    }
    emit();
  },
  remove(id: string) {
    items = items.filter((i) => i.id !== id);
    emit();
  },
  setQty(id: string, qty: number) {
    if (qty <= 0) return cart.remove(id);
    items = items.map((i) => (i.id === id ? { ...i, qty } : i));
    emit();
  },
  clear() {
    items = [];
    emit();
  },
  get items() {
    return items;
  },
};
