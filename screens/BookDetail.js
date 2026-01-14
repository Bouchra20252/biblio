import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { FavoritesContext } from '../context/FavoritesContext';
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get('window');

export default function BookDetailScreen({ route, navigation }) {
  const { book } = route.params;
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const { user } = useContext(UserContext);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

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

  const isFavorite = favorites.includes(book._id);

  const toggleFavorite = () => {
    if (!user?._id) {
      Alert.alert("Member Access", "Please log in to curate your personal favorites.");
      return;
    }
    isFavorite ? removeFavorite(book._id) : addFavorite(book);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('http://172.20.10.3:5000/reviews');
        const bookReviews = res.data.filter(r => String(r.bookId) === String(book._id));
        setReviews(bookReviews);
      } catch (err) { console.log(err); }
    };
    fetchReviews();
  }, [book._id]);

  const submitReview = async () => {
    if (!rating || !comment) return alert("Please provide both a rating and a thought.");
    try {
      const res = await axios.post('http://172.20.10.3:5000/reviews', {
        bookId: book._id,
        userId: user.email,
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString().split('T')[0]
      });
      setReviews(prev => [...prev, res.data]);
      setRating('');
      setComment('');
    } catch (err) { console.error(err); }
  };

  return (
    <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
      
      {/* 1. HERO IMAGE SECTION */}
      <View style={styles.imageContainer}>
        <Image source={coverMap[book.cover]} style={styles.cover} resizeMode="cover" />
        <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
           <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* 2. HEADER INFO */}
      <View style={styles.contentCard}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>By {book.author}</Text>
          </View>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favBtn}>
            <Text style={{ fontSize: 28 }}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {/* 3. MAIN ACTION */}
        <TouchableOpacity
          style={styles.readNowBtn}
          onPress={() => navigation.navigate('ReadingView', { content: book.content, title: book.title })}
        >
          <Text style={styles.readNowText}>DIVE INTO THE STORY</Text>
          <Text style={styles.btnIcon}>📖</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 4. REVIEW FORM */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Share Your Thoughts</Text>
          <Text style={styles.sectionSubtitle}>How would you rate this work?</Text>
        </View>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Score (1-10)"
            placeholderTextColor="#999"
            value={rating}
            onChangeText={setRating}
            keyboardType="numeric"
            style={styles.ratingInput}
          />
          <TextInput
            placeholder="Write a brief reflection..."
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
            multiline
            style={styles.commentInput}
          />
          <TouchableOpacity style={styles.submitBtn} onPress={submitReview}>
            <Text style={styles.submitBtnText}>Post Review</Text>
          </TouchableOpacity>
        </View>

        {/* 5. REVIEWS LIST */}
        <Text style={[styles.sectionTitle, { marginTop: 40, marginBottom: 20 }]}>Community Reflections</Text>
        
        {reviews.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.noReviews}>No thoughts shared yet. Be the first to reflect.</Text>
          </View>
        ) : (
          reviews.slice().reverse().map((r, i) => (
            <View key={i} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{r.userId.split('@')[0]}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {r.rating}</Text>
                </View>
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
  mainContainer: { flex: 1, backgroundColor: '#FDFCF7' },
  imageContainer: { width: width, height: 450, position: 'relative' },
  cover: { width: '100%', height: '100%' },
  backCircle: { position: 'absolute', top: 50, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  backArrow: { fontSize: 20, color: '#2C6142', fontWeight: 'bold' },
  
  contentCard: { 
    marginTop: -30, 
    backgroundColor: '#FDFCF7', 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35, 
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  title: { fontSize: 32, fontWeight: '900', color: '#1A3C29', letterSpacing: -0.5 },
  author: { fontSize: 16, color: '#2C6142', fontWeight: '600', textTransform: 'uppercase', marginTop: 4, letterSpacing: 1 },
  favBtn: { padding: 5 },
  
  readNowBtn: {
    backgroundColor: '#2C6142',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    elevation: 4
  },
  readNowText: { color: '#fff', fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
  btnIcon: { marginLeft: 10, fontSize: 18 },

  divider: { height: 1, backgroundColor: 'rgba(44, 97, 66, 0.1)', marginBottom: 35 },
  
  sectionHeader: { marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: '#1A3C29' },
  sectionSubtitle: { fontSize: 14, color: '#666', fontStyle: 'italic', marginTop: 2 },

  formCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 2, borderWidth: 1, borderColor: '#F0EFEA' },
  ratingInput: { borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 10, fontSize: 16, color: '#2C6142', fontWeight: 'bold', marginBottom: 15 },
  commentInput: { fontSize: 15, color: '#444', height: 80, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#2C6142', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },

  reviewCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#2C6142', elevation: 2 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  reviewUser: { fontWeight: '800', color: '#1A3C29', fontSize: 15 },
  ratingBadge: { backgroundColor: 'rgba(44, 97, 66, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { color: '#2C6142', fontWeight: 'bold', fontSize: 12 },
  reviewComment: { color: '#555', lineHeight: 22, fontSize: 14 },
  reviewDate: { fontSize: 11, color: '#AAA', marginTop: 12, textTransform: 'uppercase' },
  emptyBox: { padding: 40, alignItems: 'center' },
  noReviews: { fontStyle: 'italic', color: '#999', textAlign: 'center' }
});