import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cartCount: 0,
  
  setCartCount: (count) => set({ cartCount: count }),
  
  incrementCart: (amount = 1) => set((state) => ({ 
    cartCount: state.cartCount + amount 
  })),
  
  decrementCart: (amount = 1) => set((state) => ({ 
    cartCount: Math.max(0, state.cartCount - amount) 
  })),
  
  resetCart: () => set({ cartCount: 0 }),
}));
