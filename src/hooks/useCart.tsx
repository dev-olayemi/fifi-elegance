import { createContext, useContext, useState, ReactNode } from "react";
import { activityLogger } from "@/utils/activityLogger";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (i) => i.id === item.id && i.size === item.size
      );
      let newCart;
      if (existingItem) {
        newCart = prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newCart = [...prev, item];
      }
      
      // Calculate new total
      const newTotal = newCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      
      // Log the action
      activityLogger.logAddToCart(
        item.id,
        item.name,
        item.price,
        item.size,
        item.quantity,
        newTotal
      );
      
      return newCart;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size: string) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === id && item.size === size);
      const newCart = prev.filter((item) => !(item.id === id && item.size === size));
      
      if (itemToRemove) {
        const newTotal = newCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        // Log the action
        activityLogger.logRemoveFromCart(
          id,
          itemToRemove.name,
          itemToRemove.price,
          size,
          itemToRemove.quantity,
          newTotal
        );
      }
      
      return newCart;
    });
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
