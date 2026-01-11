// screens/Home.js
import React, { useState, useRef } from 'react';

import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';

export default function Home({ navigation }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;



  const openSidebar = () => {
  setSidebarOpen(true);
  Animated.timing(slideAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  }).start();
};

const closeSidebar = () => {
  Animated.timing(slideAnim, {
    toValue: -300,
    duration: 300,
    useNativeDriver: false,
  }).start(() => setSidebarOpen(false));
};



  return (
    <View style={styles.container}>

      {/* TOP BAR */}
      <View style={styles.topBar}>


        <TouchableOpacity onPress={openSidebar}>

          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.appName}>Biblio 📚</Text>
      </View>

      

      {/* MAIN CONTENT */}
      <View style={styles.content}>
        <Image
          source={require('../assets/logo.jpg')}
          style={styles.logo}
        />

        <Text style={styles.subtitle}>
          Explore books, read your favorite stories, and stay motivated!
        </Text>

        <Button
          title="Go to Library"
          onPress={() => navigation.navigate('Library')}
        />
      </View>



      {/* SIDEBAR */}
      {sidebarOpen && (
        <Animated.View style={[styles.sidebar, { left: slideAnim }]}>

          <Text style={styles.close} onPress={closeSidebar}>✕</Text>


          <Text style={styles.menuItem} onPress={() => navigation.navigate('Home')}>Home</Text>
          <Text style={styles.menuItem} onPress={() => navigation.navigate('Library')}>Library</Text>
          <Text style={styles.menuItem} onPress={() => navigation.navigate('Favorites')}>Favorites</Text>
          <Text style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>Profile</Text>
        </Animated.View>
      )}
 
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 4,
  },

  menuButton: {
    fontSize: 26,
    marginRight: 15,
  },

  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c6142ff',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 19,
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c6142ff',
  },

  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    elevation: 10,
    zIndex: 999,
  },

  close: {
    fontSize: 22,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },

  menuItem: {
    fontSize: 18,
    marginVertical: 15,
  },
});

