import React, { useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { FavoritesContext } from '../context/FavoritesContext';

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useContext(FavoritesContext);

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

  // Filter out any null/undefined items
  const validFavorites = favorites.filter(f => f && f._id);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Curated Collection</Text>
      <Text style={styles.headerSub}>YOUR PERSONAL ARCHIVE</Text>
      <View style={styles.headerLine} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyOrnament}>❦</Text>
      <Text style={styles.emptyText}>The archive is currently empty.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={validFavorites}
        keyExtractor={(item) => item._id.toString()}
        ListHeaderComponent={validFavorites.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        numColumns={2} // Grid layout to match Library style
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bookCard}
            onPress={() => navigation.navigate('ReadingView', {
              title: item.title,
              content: item.content,
              bookId: item._id 
            })}
          >
            <View style={styles.imageContainer}>
              <Image 
                source={coverMap[item.cover] || require('../assets/book-one.png')} 
                style={styles.cover} 
              />
              <View style={styles.heartBadge}>
                <Text style={styles.heartText}>♥</Text>
              </View>
            </View>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfcf7' },
  listContent: { padding: 20 },
  header: { marginBottom: 30, alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1a3c29', letterSpacing: -1 },
  headerSub: { fontSize: 10, fontWeight: 'bold', color: '#2c6142', letterSpacing: 2, marginTop: 4, opacity: 0.7 },
  headerLine: { width: 40, height: 2, backgroundColor: '#2c6142', marginTop: 12 },
  row: { justifyContent: 'space-between' },
  bookCard: { width: '47%', marginBottom: 25 },
  imageContainer: { 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5,
    elevation: 5,
    position: 'relative'
  },
  cover: { width: '100%', height: 230, borderRadius: 8, backgroundColor: '#e8e6df' },
  heartBadge: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    backgroundColor: 'rgba(253, 252, 247, 0.9)', 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  heartText: { color: '#e74c3c', fontSize: 14 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#1a3c29', marginTop: 10, textAlign: 'center' },
  author: { fontSize: 11, color: '#2c6142', fontStyle: 'italic', textAlign: 'center', opacity: 0.8 },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyOrnament: { fontSize: 40, color: '#2c6142', opacity: 0.2 },
  emptyText: { color: '#2c6142', fontStyle: 'italic', marginTop: 10, opacity: 0.5 }
});