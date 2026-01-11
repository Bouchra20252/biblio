import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'react-native';
import axios from 'axios';
import { FavoritesContext } from '../context/FavoritesContext';
import { UserContext } from '../context/UserContext';

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const { user } = useContext(UserContext);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const coverMap = {
    "assets/book-one.png": require('../assets/book-one.png'),
  };

  // ---------------- FAVORITE LOGIC ----------------
  // Since your Context saves IDs, we check if this book's ID is in the favorites array
  const isFavorite = favorites.includes(book._id);

  const toggleFavorite = () => {
    console.log("USER 👉", user);
    console.log("BOOK 👉", book);

    if (!user?._id) {
      Alert.alert("Login required", "Please log in to use favorites");
      return;
    }

    if (isFavorite) {
      removeFavorite(book._id);
    } else {
      addFavorite(book); 
    }
  };

  // ---------------- REVIEWS ----------------
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('http://192.168.1.15:5000/reviews');
        const bookReviews = res.data.filter(r => String(r.bookId) === String(book._id));
        setReviews(bookReviews);
      } catch (err) {
        console.log("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [book._id]);

  const submitReview = async () => {
    console.log("Submit clicked!");
    if (!rating || !comment) return alert("Fill in rating and comment");
    try {
      const res = await axios.post('http://192.168.1.15:5000/reviews', {
        bookId: book._id,
        userId: user.email,
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString().split('T')[0]
      });
      setReviews(prev => [...prev, res.data]);
      setRating('');
      setComment('');
    } catch (err) {
      console.error("Submission error:", err.response ? err.response.data : err.message);
    }
  };

  // ---------------- RENDER ----------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={coverMap[book.cover]} style={styles.cover} />

      <View style={styles.header}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <Text
            style={{
              color: isFavorite ? 'red' : 'gray',
              fontSize: 28
            }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.readNowBtn}
        onPress={() => navigation.navigate('ReadingView', { content: book.content, title: book.title })}
      >
        <Text style={styles.readNowText}>Start Reading Now 📖</Text>
      </TouchableOpacity>

      <View style={styles.hr} />

      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>Share your thoughts</Text>
        <View style={styles.formCard}>
          <TextInput
            placeholder="Rating (1-10)"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="What did you think of this book?"
            value={comment}
            onChangeText={setComment}
            multiline
            style={[styles.input, { height: 80 }]}
          />
          <TouchableOpacity style={styles.submitBtn} onPress={submitReview}>
            <Text style={styles.submitBtnText}>Post Review</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Readers sharing their opinion</Text>
        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
        ) : (
          reviews.slice().reverse().map((r, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{r.userId.split('@')[0]}</Text>
                <Text style={styles.reviewRating}>⭐ {r.rating}/10</Text>
              </View>
              <Text style={styles.reviewComment}>{r.comment}</Text>
              <Text style={styles.reviewDate}>{r.date}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  cover: { width: '100%', height: 350, borderRadius: 15, marginBottom: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  author: { fontSize: 18, color: '#666', marginBottom: 10 },
  hr: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#222' },
  formCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10 },
  submitBtn: { backgroundColor: '#0072ff', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  reviewCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#0072ff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  reviewUser: { fontWeight: 'bold', color: '#333' },
  reviewRating: { color: '#f39c12', fontWeight: 'bold' },
  reviewComment: { color: '#555', lineHeight: 20 },
  reviewDate: { fontSize: 12, color: '#999', marginTop: 8 },
  noReviews: { fontStyle: 'italic', color: '#999', textAlign: 'center' },
  readNowBtn: {
    backgroundColor: '#6e707eff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  readNowText: {
    color: '#f6f6f4ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});