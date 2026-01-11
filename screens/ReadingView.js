import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReadingView({ route, navigation }) {
  const { content, title } = route.params;

  const themes = {
    light: { bg: '#FFFFFF', text: '#2c3e50', title: '#0072ff', line: '#FFD700' },
    vintage: { bg: '#f4ecd8', text: '#5b4636', title: '#8b4513', line: '#d4a373' }, 
    midnight: { bg: '#1a1a2e', text: '#e0e0e0', title: '#4cc9f0', line: '#4834d4' }  
  };

  const [theme, setTheme] = useState('vintage');
  const [currentScroll, setCurrentScroll] = useState(0); 
  const [bookmarkedPos, setBookmarkedPos] = useState(null);
  const [mode, setMode] = useState('PIN'); 
  const [isAiming, setIsAiming] = useState(false); 

  const scrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const active = themes[theme];

  useEffect(() => {
    const loadSavedPos = async () => {
      try {
        const val = await AsyncStorage.getItem(`@pin_${title}`);
        if (val !== null) {
          setBookmarkedPos(parseFloat(val));
          setMode('GOTO');
        }
      } catch (e) { console.log(e); }
    };
    loadSavedPos();
  }, []);

  const flashLine = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
      Animated.delay(3000), 
      Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: false })
    ]).start();
  };

  const handleButtonPress = () => {
    if (mode === 'GOTO' && bookmarkedPos !== null) {
      scrollRef.current?.scrollTo({ y: bookmarkedPos, animated: true });
      flashLine();
      setMode('PIN');
    } else {
      setIsAiming(true);
      // REFINED ALERT TEXT
      Alert.alert(
        "Set Your Mark",
        "Navigate to your current line and tap the text to place your bookmark.",
        [{ text: "Continue", style: "default" }]
      );
    }
  };

  const confirmPinAtTap = async () => {
    if (!isAiming) return;

    try {
      const positionToSave = currentScroll;
      await AsyncStorage.setItem(`@pin_${title}`, positionToSave.toString());
      setBookmarkedPos(positionToSave);
      setIsAiming(false);
      setMode('GOTO');
      
      Alert.alert("Bookmark Set", "We've saved your place.");
    } catch (e) { console.log(e); }
  };

  return (
    <View style={[styles.container, { backgroundColor: active.bg }]}>
      
      <View style={styles.topBar}>
        <View style={{ width: 80 }} /> 

        <View style={styles.themeDots}>
          {['light', 'vintage', 'midnight'].map((t) => (
            <TouchableOpacity 
              key={t}
              style={[styles.dot, { backgroundColor: themes[t].bg, borderColor: theme === t ? active.title : '#ccc', borderWidth: theme === t ? 2 : 1 }]} 
              onPress={() => setTheme(t)} 
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.pinBtn, { backgroundColor: isAiming ? '#E67E22' : (mode === 'GOTO' ? '#ff4757' : '#555') }]}
          onPress={handleButtonPress}
          onLongPress={async () => {
            await AsyncStorage.removeItem(`@pin_${title}`);
            setBookmarkedPos(null);
            setMode('PIN');
            setIsAiming(false);
            Alert.alert("Removed", "Your bookmark has been cleared.");
          }}
        >
          <Text style={styles.pinText}>{isAiming ? "TAP TEXT" : mode}</Text>
        </TouchableOpacity>
      </View>

      {/* REFINED BANNER STYLE */}
      {isAiming && (
        <View style={styles.aimingBanner}>
          <Text style={styles.aimingText}>Choose a spot to bookmark...</Text>
        </View>
      )}

      <ScrollView 
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        onScroll={(e) => setCurrentScroll(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={confirmPinAtTap} 
        >
          <Text style={[styles.bookTitle, { color: active.title }]}>{title}</Text>
          
          <Animated.View style={[styles.lineFlash, { 
            backgroundColor: active.line,
            top: (bookmarkedPos || 0) + 120, 
            opacity: fadeAnim,
          }]} />

          <Text style={[styles.textContent, { color: active.text }]}>
            {content ? content.replace(/\\n/g, '\n') : "No content available."}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingTop: 50, 
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  themeDots: { 
    flexDirection: 'row',
    position: 'absolute',
    left: '50%',
    marginLeft: -55,
    top: 55,
  },
  dot: { width: 26, height: 26, borderRadius: 13, marginHorizontal: 6 },
  pinBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, minWidth: 75, alignItems: 'center', elevation: 4 },
  pinText: { color: 'white', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  aimingBanner: { 
    backgroundColor: 'rgba(230, 126, 34, 0.1)', 
    paddingVertical: 8, 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230, 126, 34, 0.2)'
  },
  aimingText: { color: '#E67E22', fontSize: 12, fontWeight: '600', fontStyle: 'italic' },
  scrollContent: { padding: 25, paddingBottom: 100 },
  bookTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 30 },
  textContent: { fontSize: 19, lineHeight: 34, textAlign: 'left' },
  lineFlash: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 45, 
    zIndex: -1,
  }
});