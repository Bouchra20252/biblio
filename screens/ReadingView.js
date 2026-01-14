import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';

export default function ReadingView({ route, navigation }) {
  const { content, title, bookId } = route.params; 
  const { markAsFinished } = useContext(UserContext);

  const themes = {
    light: { bg: '#FFFFFF', text: '#2c3e50', title: '#2C6142', line: '#E8F0EA' },
    vintage: { bg: '#FDFCF7', text: '#5b4636', title: '#2C6142', line: '#F2E8CF' }, 
    midnight: { bg: '#1a1a2e', text: '#e0e0e0', title: '#E8F0EA', line: '#2C6142' }  
  };

  const [theme, setTheme] = useState('vintage');
  const [currentScroll, setCurrentScroll] = useState(0); 
  const [bookmarkedPos, setBookmarkedPos] = useState(null);
  const [mode, setMode] = useState('PIN'); 
  const [isAiming, setIsAiming] = useState(false); 

  const scrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const active = themes[theme];

  // Load bookmark on mount
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
      Alert.alert("Set Your Mark", "Navigate to your line and tap the text to place your pin.");
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
      Alert.alert("Pin Set", "Your position is archived.");
    } catch (e) { console.log(e); }
  };

  const handleFinishBook = async () => {
    const success = await markAsFinished(bookId);
    if (success) {
      Alert.alert("Congratulations!", "Book archived in your finished collection.");
      navigation.navigate('Profile');
    } else {
      Alert.alert("Error", "Could not update archive. Try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: active.bg }]}>
      
      {/* HEADER CONTROLS */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Text style={[styles.backIcon, { color: active.title }]}>←</Text>
        </TouchableOpacity>

        <View style={styles.themeDots}>
          {['light', 'vintage', 'midnight'].map((t) => (
            <TouchableOpacity 
              key={t}
              style={[styles.dot, { 
                backgroundColor: themes[t].bg, 
                borderColor: theme === t ? active.title : '#ccc', 
                borderWidth: theme === t ? 2 : 1 
              }]} 
              onPress={() => setTheme(t)} 
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.pinBtn, { backgroundColor: isAiming ? '#D4A373' : (mode === 'GOTO' ? '#2C6142' : '#555') }]}
          onPress={handleButtonPress}
          onLongPress={async () => {
            await AsyncStorage.removeItem(`@pin_${title}`);
            setBookmarkedPos(null);
            setMode('PIN');
            Alert.alert("Cleared", "Bookmark removed.");
          }}
        >
          <Text style={styles.pinText}>{isAiming ? "TAP TEXT" : mode}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        onScroll={(e) => setCurrentScroll(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        <TouchableOpacity activeOpacity={1} onPress={confirmPinAtTap}>
          
          <View style={styles.titleContainer}>
             <Text style={[styles.bookTitle, { color: active.title }]}>{title}</Text>
             <View style={[styles.titleUnderline, { backgroundColor: active.title }]} />
          </View>
          
          <Animated.View style={[styles.lineFlash, { 
            backgroundColor: active.line,
            top: (bookmarkedPos || 0) + 185, 
            opacity: fadeAnim,
          }]} />

          <Text style={[styles.textContent, { color: active.text }]}>
            {content ? content.replace(/\\n/g, '\n') : "No content available."}
          </Text>

          {/* FINIS SECTION */}
          <View style={styles.finishSection}>
            <View style={[styles.ornament, { backgroundColor: active.title }]} />
            <Text style={[styles.finisText, { color: active.title }]}>THE END</Text>
            <TouchableOpacity 
              style={[styles.finishBtn, { borderColor: active.title }]} 
              onPress={handleFinishBook}
            >
              <Text style={[styles.finishBtnText, { color: active.title }]}>MARK AS FINISHED</Text>
            </TouchableOpacity>
          </View>

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
  backIcon: { fontSize: 24, fontWeight: 'bold' },
  themeDots: { 
    flexDirection: 'row',
    position: 'absolute',
    left: '50%',
    marginLeft: -50,
    top: 55,
  },
  dot: { width: 22, height: 22, borderRadius: 11, marginHorizontal: 5 },
  pinBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, minWidth: 75, alignItems: 'center' },
  pinText: { color: 'white', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  scrollContent: { padding: 25, paddingBottom: 60 },
  titleContainer: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  bookTitle: { fontSize: 28, fontWeight: '900', textAlign: 'center', letterSpacing: -1 },
  titleUnderline: { width: 30, height: 3, marginTop: 12, borderRadius: 2 },
  textContent: { fontSize: 19, lineHeight: 34, textAlign: 'left' },
  lineFlash: { position: 'absolute', left: 0, right: 0, height: 45, zIndex: -1 },
  finishSection: { paddingVertical: 80, alignItems: 'center', marginTop: 40 },
  ornament: { width: 60, height: 1, marginBottom: 20, opacity: 0.3 },
  finisText: { fontSize: 22, fontWeight: '900', letterSpacing: 12, marginBottom: 40 },
  finishBtn: { borderWidth: 1, paddingVertical: 15, paddingHorizontal: 35, borderRadius: 2 },
  finishBtnText: { fontWeight: 'bold', letterSpacing: 2, fontSize: 11 }
});