// screens/LibraryScreen.js
import React, { useState , useContext, useEffect } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function LibraryScreen({ navigation }) {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
 const [books, setBooks] = useState([]);
//
 const coverMap = {
  "assets/book-one.png": require('../assets/book-one.png'),
 
};


 
useEffect(() => {
  axios.get('http://192.168.1.15:5000/books')
    .then(res => setBooks(res.data))
    .catch(err => console.log(err));
}, []);

 const toggleFavorite = (book) => {
    const exists = favorites.find(b => b._id === book._id);
    exists ? removeFavorite(book._id) : addFavorite(book);
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {books.map(book => (
        <View key={book._id} style={styles.card}>
          <Image
            source={coverMap[book.cover]}
            style={styles.cover}
          />

          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>
          <Text style={styles.description}>{book.description}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('BookDetail', { book })}
              style={styles.detailButton}
            >
              <Text style={styles.detailText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleFavorite(book)}>
              <Text style={{ fontSize: 20 }}>
                {favorites.find(b => b._id === book._id) ? '❤️' : '🤍'}
                
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { padding:20, alignItems:'center' },
  card: { width:'100%', backgroundColor:'#f2f2f2', borderRadius:10, padding:15, marginBottom:20 },
  cover: { width:'100%', height:200, borderRadius:10, marginBottom:10 },
  title: { fontSize:18, fontWeight:'bold' },
  author: { fontSize:14, fontStyle:'italic', marginBottom:5 },
  description: { fontSize:14, marginBottom:10 },
  buttons: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  detailButton: { backgroundColor:'#0072ff', padding:8, borderRadius:5 },
  detailText: { color:'#fff' },
  favButton: { padding:8 }
});

