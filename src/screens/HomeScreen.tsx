// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../contexts/AppContext';
import { launchCamera } from 'react-native-image-picker';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({navigation}: Props): JSX.Element {
  const { state, actions } = useApp();

  const handleTakePhoto = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
      });

      if (result.assets && result.assets[0]) {
        actions.setCurrentPhoto({
          uri: result.assets[0].uri || '',
          base64: result.assets[0].base64,
          width: result.assets[0].width,
          height: result.assets[0].height,
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Thoughts App</Text>
      <Button title="Take Photo" onPress={handleTakePhoto} />
      {state.currentPhoto && (
        <Text>Photo taken! Path: {state.currentPhoto.uri}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
