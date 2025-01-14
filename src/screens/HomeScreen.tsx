// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigation/MainStack';
import { useApp } from '../contexts/AppContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Camera, Image as ImageIcon } from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

function HomeScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const { actions } = useApp();

  const handleImageSelection = async (type: 'camera' | 'gallery') => {
    try {
      const launch = type === 'camera' ? launchCamera : launchImageLibrary;
      const result = await launch({
        mediaType: 'photo',
        includeBase64: true,
      });

      if (result.assets && result.assets[0]) {
        const photo = {
          uri: result.assets[0].uri || '',
          base64: result.assets[0].base64,
          width: result.assets[0].width,
          height: result.assets[0].height,
        };
        
        actions.setCurrentPhoto(photo);
        
        navigation.navigate('PhotoPreview', {
          photoUri: photo.uri,
          base64: photo.base64,
          width: photo.width,
          height: photo.height,
        });
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Thoughts</Text>
      
      <View style={styles.captureSection}>
        <Text style={styles.sectionTitle}>Capture Magic</Text>
        <View style={styles.captureButtons}>
          <Pressable 
            style={styles.captureButton}
            onPress={() => handleImageSelection('camera')}
          >
            <Camera size={32} color="#fff" />
            <Text style={styles.captureButtonText}>Take Photo</Text>
          </Pressable>
          
          <Pressable 
            style={styles.captureButton}
            onPress={() => handleImageSelection('gallery')}
          >
            <ImageIcon size={32} color="#fff" />
            <Text style={styles.captureButtonText}>Choose Photo</Text>
          </Pressable>
        </View>
      </View>

      <Pressable 
        style={styles.worldButton}
        onPress={() => navigation.navigate('YourPetsWorld')}
      >
        <Text style={styles.worldButtonText}>Enter Your Pet's World</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 40,
    color: '#007AFF',
  },
  captureSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  captureButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  captureButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: 150,
    gap: 12,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  worldButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  worldButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;