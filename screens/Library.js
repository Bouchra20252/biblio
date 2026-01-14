import React, { useState, useContext, useEffect } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';

export default function LibraryScreen({ navigation }) {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const [books, setBooks] = useState([]);

  const coverMap = {
    "assets/book-one.png": require('../assets/book-one.png'),
    "assets/book-1984.png": require('../assets/1984.png'),
    "assets/book-mockingbird.png": require('../assets/tokill.png'),
    "assets/book-pride.png": require('../assets/pride.png'),
    "assets/book-hobbit.png": require('../assets/hobbit.png'),
    "assets/book-catcher.png": require('../assets/catcher.png'),
    "assets/book-janeeyre.png": require('../assets/janeeyre.png'),
    "assets/book-bravenewworld.png": require('../assets/bravenewworld.png'),
    "assets/book-warpeace.png": require('../assets/warpeace.png'),
    "assets/book-crime.png": require('../assets/crimepunishement.png'),
    "assets/book-lotr.png": require('../assets/lordoftherings.png'),
    "assets/book-narnia.png": require('../assets/narnia.png'),
    "assets/book-anna.png": require('../assets/anna.png'),
    "assets/book-alchemist.png": require('../assets/alchemist.png'),
    "assets/book-beforeyou.png": require('../assets/mebeforeyou.png'),

  };

  useEffect(() => {
    axios.get('http://172.20.10.3:5000/books')
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, []);

  const toggleFavorite = (book) => {
    const exists = favorites.find(b => b._id === book._id);
    exists ? removeFavorite(book._id) : addFavorite(book);
  };

  return (
    <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Library</Text>
        <Text style={styles.headerSubtitle}>Pick up where you left off</Text>
      </View>

      {books.map((book) => {
        const isFav = favorites.find(b => b._id === book._id);
        
        return (
          /* REDIRECTION: Happens when the whole card is clicked */
          <TouchableOpacity 
            key={book._id} 
            activeOpacity={0.95}
            onPress={() => navigation.navigate('BookDetail', { book })}
            style={styles.cardWrapper}
          >
            <View style={styles.editorialCard}>
              
              {/* IMAGE SECTION */}
              <View style={styles.imageBox}>
                <Image source={coverMap[book.cover]} style={styles.coverImage} />
              </View>

              {/* DETAILS SECTION */}
              <View style={styles.detailsBox}>
                <View>
                  <View style={styles.titleRow}>
                    <Text style={styles.bookTitle} numberOfLines={1}>{book.title}</Text>
                   
                    <TouchableOpacity 
                      onPress={(e) => {
                        e.stopPropagation(); // Prevents navigation when clicking heart
                        toggleFavorite(book);
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{isFav ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.bookAuthor}>by {book.author}</Text>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                  {book.description}
                </Text>

                {/* THE VISIBLE BUTTON */}
                <View style={styles.viewDetailsBtn}>
                  <Text style={styles.btnText}>View Details</Text>
                  <Text style={styles.btnArrow}>→</Text>
                </View>
              </View>

            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FDFCF7' },
  headerSection: { paddingHorizontal: 25, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 34, fontWeight: '900', color: '#2C6142' },
  headerSubtitle: { fontSize: 14, color: '#666', marginTop: 4, fontStyle: 'italic' },
  cardWrapper: { paddingHorizontal: 20, marginBottom: 20 },
  editorialCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    flexDirection: 'row',
    height: 170,
    padding: 12,
    elevation: 4,
    shadowColor: '#2C6142',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageBox: {
    width: 100,
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  detailsBox: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A3C29', flex: 1, marginRight: 5 },
  bookAuthor: { fontSize: 12, color: '#2C6142', fontWeight: '600', textTransform: 'uppercase' },
  description: { fontSize: 13, color: '#777', lineHeight: 18 },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Light gray subtle button
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnText: { fontSize: 11, fontWeight: 'bold', color: '#2C6142', marginRight: 5 },
  btnArrow: { fontSize: 12, color: '#2C6142' }
});