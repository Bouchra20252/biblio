import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';
import { FavoritesContext } from '../context/FavoritesContext';

export default function ProfileScreen({ navigation }) {
  const { user, logoutUser } = useContext(UserContext);
  const { favorites } = useContext(FavoritesContext);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const response = await fetch('http://172.20.10.3:5000/books');
        const booksData = await response.json();

        const keys = await AsyncStorage.getAllKeys();
        const pinKeys = keys.filter(k => k.startsWith('@pin_'));
        
        const list = pinKeys.map(k => {
          const bookTitle = k.replace('@pin_', '');
          const matchingBook = booksData.find(b => b.title === bookTitle);
          return {
            title: bookTitle,
            bookId: matchingBook ? matchingBook._id : null,
            content: matchingBook ? matchingBook.content : null,
            key: k
          };
        });
        setHistory(list);
      } catch (e) {
        console.log("Error loading profile data:", e);
      }
    };

    const focusListener = navigation.addListener('focus', loadProfileData);
    return focusListener;
  }, [navigation]);

  const confirmLogout = () => {
    Alert.alert(
      "End Session",
      "Are you sure you want to return to the login screen?",
      [
        { text: "Stay", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logoutUser }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarBorder}>
          <Image source={require('../assets/profilebyd.jpg')} style={styles.avatar} />
        </View>
        <Text style={styles.name}>{user?.email?.split('@')[0] || 'Member'}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>BIBLIO ARCHIVIST</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{user?.booksRead?.length || 0}</Text>
          <Text style={styles.statLabel}>Finished</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reading Journey</Text>
          <View style={styles.titleLine} />
        </View>
        
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active bookmarks yet.</Text>
          </View>
        ) : (
          history.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.historyItem}
              onPress={() => {
                if (item.content && item.bookId) {
                  navigation.navigate('ReadingView', { 
                    title: item.title, 
                    content: item.content,
                    bookId: item.bookId 
                  });
                } else {
                  Alert.alert("Error", "Content not found in library.");
                }
              }}
            >
              <View style={styles.historyTextContent}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historySub}>RESUME AT PIN</Text>
              </View>
              <View style={styles.arrowCircle}>
                <Text style={styles.arrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
        <Text style={styles.logoutText}>CLOSE ARCHIVE SESSION</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfcf7', padding: 25 },
  header: { alignItems: 'center', marginTop: 50, marginBottom: 30 },
  avatarBorder: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#2c6142',
    marginBottom: 15,
    borderStyle: 'dashed'
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 28, fontWeight: '900', color: '#1a3c29', textTransform: 'capitalize', letterSpacing: -1 },
  badge: { backgroundColor: '#2c6142', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, marginTop: 8 },
  badgeText: { color: '#fdfcf7', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 30 },
  statBox: { 
    backgroundColor: '#fff', 
    width: '47%', 
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e6df',
    elevation: 2
  },
  statNum: { fontSize: 24, fontWeight: 'bold', color: '#1a3c29' },
  statLabel: { fontSize: 11, color: '#2c6142', fontWeight: 'bold', marginTop: 4, opacity: 0.7, textTransform: 'uppercase' },
  section: { marginTop: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a3c29', marginRight: 10 },
  titleLine: { flex: 1, height: 1, backgroundColor: '#1a3c29', opacity: 0.1 },
  historyItem: { 
    backgroundColor: '#fff', 
    padding: 18, 
    borderRadius: 18, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8e6df'
  },
  historyTextContent: { flex: 1 },
  historyTitle: { fontSize: 17, fontWeight: 'bold', color: '#1a3c29', marginBottom: 4 },
  historySub: { fontSize: 9, color: '#2c6142', fontWeight: '900', letterSpacing: 1 },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fdfcf7', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2c6142' },
  arrow: { fontSize: 16, color: '#2c6142', fontWeight: 'bold' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#999', fontStyle: 'italic' },
  logoutBtn: { marginTop: 40, padding: 20, alignItems: 'center', marginBottom: 60 },
  logoutText: { color: '#e74c3c', fontWeight: '900', fontSize: 11, letterSpacing: 2 }
});