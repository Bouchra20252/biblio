// screens/BookDetailScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'react-native';

export default function BookDetailScreen({ route }) {
  const { book } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image source={book.cover} style={styles.cover} />

      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>by {book.author}</Text>
      <Text style={styles.content}>{book.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding:20 },
  title: { fontSize:22, fontWeight:'bold', marginBottom:5 },
  author: { fontSize:16, fontStyle:'italic', marginBottom:15 },
  content: { fontSize:16, lineHeight:22 },
  cover: { width: '100%', height: 250, borderRadius: 10, marginBottom: 15 },
  content: { fontSize:16, lineHeight:26 }

});
