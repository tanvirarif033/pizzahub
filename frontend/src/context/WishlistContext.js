import { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const res = await API.get('/wishlist');
      setWishlist(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const add = async (pizza) => {
    await API.post('/wishlist', { pizzaId: pizza.id });
    setWishlist(prev => [...prev, pizza]);
  };

  const remove = async (pizzaId) => {
    await API.delete(`/wishlist/${pizzaId}`);
    setWishlist(prev => prev.filter(p => p.id !== pizzaId));
  };

  const isInWishlist = (id) => {
    return wishlist.some(p => p.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, add, remove, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);