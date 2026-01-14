import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';


export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(UserContext);
  const API_URL = "http://172.20.10.3:5000";

  useEffect(() => {
    if (user?._id) {
      loadFavorites();
    } else {
      setFavorites([]); 
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const res = await axios.get(`${API_URL}/favorites/${user._id}`);
      // Mapping to get the full book object stored in 'bookId'
      const fullBooks = res.data.map(f => f.bookId);
      setFavorites(fullBooks);
    } catch (error) {
      console.log("Load favorites error ", error.message);
    }
  };

  const addFavorite = async (book) => {
    try {
      await axios.post(`${API_URL}/favorites`, {
        userId: user._id,
        bookId: book._id
      });

      setFavorites(prev => {
        const alreadyExists = prev.some(b => b._id === book._id);
        return alreadyExists ? prev : [...prev, book];
      });
    } catch (error) {
      console.log("Add favorite error ❌", error.message);
    }
  };

  const removeFavorite = async (bookId) => {
    try {
      await axios.delete(`${API_URL}/favorites`, {
        data: { userId: user._id, bookId }
      });
      setFavorites(prev => prev.filter(b => b._id !== bookId));
    } catch (error) {
      console.log("Remove favorite error ❌", error.message);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};