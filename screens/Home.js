import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';


const { width } = Dimensions.get('window');

export default function Home({ navigation }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const floatAnim = useRef(new Animated.Value(0)).current; // Logo floating

  // Floating Animation for the Logo
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -15, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setSidebarOpen(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleDecor} />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={openSidebar} style={styles.iconCircle}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.appName}>Biblio</Text>
        <View style={{ width: 40 }} /> {/* Spacer for symmetry */}
      </View>

     
      <View style={styles.content}>
        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <View style={styles.logoShadow}>
            <Image
              source={require('../assets/logo.jpg')}
              style={styles.logo}
            />
          </View>
        </Animated.View>

        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.subtitle}>
          Your next favorite story is waiting to be discovered.
        </Text>

        <TouchableOpacity 
          style={styles.mainActionBtn}
          onPress={() => navigation.navigate('Library')}
        >
          <Text style={styles.btnText}>Open Library</Text>
          <Text style={styles.btnIcon}>→</Text>
        </TouchableOpacity>
      </View>

      {/* SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={closeSidebar} 
          style={styles.overlay} 
        />
      )}

      {/* SIDEBAR */}
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity onPress={closeSidebar}>
             <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuList}>
          {['Home', 'Library', 'Favorites', 'Profile'].map((item, index) => (
            <TouchableOpacity 
              key={item} 
              style={styles.menuItemContainer}
              onPress={() => { closeSidebar(); navigation.navigate(item); }}
            >
              <Text style={styles.menuNumber}>0{index + 1}</Text>
              <Text style={styles.menuItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.version}>v 1.0.2</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfcf7', // Creamy book paper color
  },
  circleDecor: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(44, 97, 66, 0.05)', // Very subtle green
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  menuButton: { fontSize: 22, color: '#2c6142' },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2c6142',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logoShadow: {
    elevation: 20,
    shadowColor: '#2c6142',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  welcomeText: {
    fontSize: 16,
    color: '#2c6142',
    marginTop: 40,
    opacity: 0.7,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 40,
    color: '#1a3c29',
    lineHeight: 32,
  },
  mainActionBtn: {
    backgroundColor: '#2c6142',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 40,
    elevation: 5,
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  btnIcon: { color: '#fff', fontSize: 20 },
  
  // SIDEBAR STYLES
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 998,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    width: '75%',
    height: '100%',
    backgroundColor: '#2c6142', // Green Sidebar
    padding: 30,
    zIndex: 999,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  sidebarTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  close: { color: '#fff', fontSize: 24 },
  menuList: { flex: 1 },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  menuNumber: { color: 'rgba(255,255,255,0.3)', marginRight: 15, fontSize: 14, fontWeight: 'bold' },
  menuItem: { fontSize: 20, color: '#fff', fontWeight: '500' },
  version: { color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center' }
});