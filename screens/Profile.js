import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { UserContext } from '../context/UserContext';
import { FavoritesContext } from '../context/FavoritesContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logoutUser } = useContext(UserContext);
  const { favorites } = useContext(FavoritesContext);

  // We pull the length of the booksRead array from your user object
  const completedCount = user?.booksRead?.length || 0;

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
      {/* Blue Header Background Decor */}
      <View style={styles.topDecoration} />

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../assets/profilebyd.jpg')} 
            style={styles.avatar} 
          />
        </View>
        <Text style={styles.name}>{user?.email?.split('@')[0] || 'Reader'}</Text>
        <Text style={styles.email}>{user?.email || 'guest@mail.com'}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Books Read</Text> 
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reading Progress</Text>
        <View style={styles.progressBox}>
          <Text style={styles.progressText}>
            {completedCount === 0 
              ? "You haven't finished any books yet. Start your journey!" 
              : `You've conquered ${completedCount} books! Keep going! 🏆`}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logoutUser}>
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8f9fa' },
  contentContainer: { alignItems: 'center', paddingBottom: 40 },
  topDecoration: {
    position: 'absolute',
    top: 0,
    width: width,
    height: 150,
    backgroundColor: '#0072ff',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  header: { 
    alignItems: 'center', 
    marginTop: 60,
    marginBottom: 20 
  },
  avatarContainer: {
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 70,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 10, textTransform: 'capitalize' },
  email: { fontSize: 14, color: '#666', marginTop: 2 },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    width: '90%', 
    marginVertical: 20 
  },
  statCard: { 
    backgroundColor: '#fff', 
    paddingVertical: 20, 
    borderRadius: 15, 
    alignItems: 'center', 
    width: '42%', 
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#0072ff' },
  statLabel: { fontSize: 13, color: '#888', marginTop: 5, fontWeight: '600' },
  section: { width: '90%', marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, marginLeft: 5 },
  progressBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#0072ff',
    elevation: 2,
  },
  progressText: { fontSize: 15, color: '#555', lineHeight: 22 },
  logoutBtn: { 
    backgroundColor: '#ff4757', 
    padding: 16, 
    borderRadius: 12, 
    width: '90%', 
    alignItems: 'center', 
    marginTop: 30,
    elevation: 2
  },
  logoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
