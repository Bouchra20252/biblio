import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(UserContext);

  const handleSignUp = async () => {
    if (!email || !password) return Alert.alert("Error", "Enter email and password");
    setLoading(true);

    try {
      const res = await axios.post('http://172.20.10.3:5000/signup', { email, password });
      loginUser({ email }); //here we save the user
      Alert.alert("Success", res.data.message);
      navigation.navigate('Home'); 
    } catch (err) {
      Alert.alert("Error", err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        keyboardType="email-address" 
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
      />
      <Button title={loading ? "Signing up..." : "Sign Up"} onPress={handleSignUp} disabled={loading} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20, backgroundColor:'#f0f0f0' },
  title: { fontSize:26, fontWeight:'bold', marginBottom:20, color:'#2e2e2e' },
  input: { width:'100%', borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginBottom:15, backgroundColor:'#fff' },
  link: { marginTop:15, color:'blue', textDecorationLine:'underline' },
});
