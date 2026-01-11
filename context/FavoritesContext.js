import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(UserContext); // ✅ real user
  const userId = user?._id;
  const API_URL = "http://192.168.1.15:5000";

  useEffect(() => {
    if (user?._id) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const res = await axios.get(`${API_URL}/favorites/${user._id}`);
      setFavorites(res.data.map(f => f.bookId._id));
    } catch (error) {
      console.log("Load favorites error ❌", error.response?.data || error.message);
    }
  };

  const addFavorite = async (book) => {
    try {
      await axios.post(`${API_URL}/favorites`, {
        userId: user._id,
        bookId: book._id
      });

      setFavorites(prev =>
        prev.find(b => b._id === book._id) ? prev : [...prev, book]
      );
    } catch (error) {
      console.log("Add favorite error ❌", error.response?.data || error.message);
    }
  };

  const removeFavorite = async (bookId) => {
    try {
      await axios.delete(`${API_URL}/favorites`, {
        data: { userId: user._id, bookId }
      });

      setFavorites(prev => prev.filter(b => b._id !== bookId));
    } catch (error) {
      console.log("Remove favorite error ❌", error.response?.data || error.message);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
