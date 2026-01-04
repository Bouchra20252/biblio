// screens/LibraryScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function LibraryScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  // Example book
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A story about the Jazz Age and the American Dream.",
      cover: require('../assets/book-one.png'),
      content: "Full text of the book goes here..."
    }
  ];

  const toggleFavorite = (bookId) => {
    setFavorites(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {books.map(book => (
        <View key={book.id} style={styles.card}>
      <Image source={book.cover} style={styles.cover} />


          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>
          <Text style={styles.description}>{book.description}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('BookDetail', { book })}
              style={styles.detailButton}
            >
              <Text style={styles.detailText}>Read</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleFavorite(book.id)} style={styles.favButton}>
              <Text style={{ color: favorites.includes(book.id) ? 'red' : 'gray' }}>❤️</Text>
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
