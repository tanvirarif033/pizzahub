import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );

  // 🔥 AUTO SYNC
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, totalQty }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);