import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { FavoritesProvider } from './context/FavoritesContext';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <FavoritesProvider>
        <AppNavigator />
      </FavoritesProvider>
    </UserProvider>
  );
}
