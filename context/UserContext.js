import React, { createContext, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const API_URL = "http://172.20.10.3:5000";

  const loginUser = (userData) => {
    setUser(userData); 
  };

  const logoutUser = () => {
    setUser(null);
  };

  const markAsFinished = async (bookId) => {
    //ensure user exists before calling API
    if (!user?._id) return false;
    //Envoie une requête au backend
    try {
      const response = await axios.post(`${API_URL}/users/finish-book`, {
        userId: user._id,
        bookId: bookId
      });

      // backend chnage lprofil bresponse li jat
      setUser(response.data.user); 
      return true;
    } catch (error) {
      console.log("Error marking book as finished:", error.response?.data || error.message);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logoutUser, markAsFinished }}>
      {children}
    </UserContext.Provider>
  );
};