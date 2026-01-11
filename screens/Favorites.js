import React, { useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { FavoritesContext } from '../context/FavoritesContext';

export default function FavoritesScreen() {
  const { favorites } = useContext(FavoritesContext);

  const coverMap = {
    "assets/book-one.png": require('../assets/book-one.png'),
    // add other covers if needed
  };

  // Filter out invalid items
  const validFavorites = favorites.filter(f => f?._id);

  if (validFavorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No favorites yet ❤️</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={validFavorites}
      keyExtractor={(item, index) => item._id?.toString() || index.toString()}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.cover && <Image source={coverMap[item.cover]} style={styles.cover} />}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  card: { marginBottom:20 },
  cover: { width:'100%', height:200, borderRadius:10 },
  title: { fontSize:18, fontWeight:'bold' },
  author: { fontSize:14, fontStyle:'italic' },
});
