// src/screens/PhotoPreviewScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '../navigation/MainStack';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'PhotoPreview'>;
type RouteProps = RouteProp<MainStackParamList, 'PhotoPreview'>;

function PhotoPreviewScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { photoUri, width, height, base64 } = route.params;
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Calculate image dimensions to fit screen while maintaining aspect ratio
    if (width && height) {
      const screenWidth = Dimensions.get('window').width;
      const screenHeight = Dimensions.get('window').height;
      const imageRatio = height / width;
      const screenRatio = screenHeight / screenWidth;

      if (imageRatio > screenRatio) {
        const newHeight = screenHeight * 0.8;
        setImageLayout({
          height: newHeight,
          width: newHeight / imageRatio,
        });
      } else {
        const newWidth = screenWidth * 0.9;
        setImageLayout({
          width: newWidth,
          height: newWidth * imageRatio,
        });
      }
    }
  }, [width, height]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photoUri }}
        style={[
          styles.image,
          {
            width: imageLayout.width,
            height: imageLayout.height,
          },
        ]}
      />
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.button} 
          onPress={() => 
            navigation.navigate('PhotoResult', {
              photoUri,
              base64,
              width,
              height,
            })
          }
        >
          <Text style={styles.buttonText}>Reveal Thoughts</Text>
        </Pressable>
        <Pressable 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Try Another Photo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    gap: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PhotoPreviewScreen;