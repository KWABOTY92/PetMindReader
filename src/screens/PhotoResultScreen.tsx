// src/screens/PhotoResultScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurView } from '@react-native-community/blur';
import { useApp } from '../contexts/AppContext';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoResult'>;

function PhotoResultScreen({ route }: Props): JSX.Element {
  const { photoUri, width, height } = route.params;
  const { state } = useApp();
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

    // Start fade-in animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [width, height, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
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
        {Platform.OS === 'ios' ? (
          <BlurView
            style={styles.thoughtContainer}
            blurType="light"
            blurAmount={10}
          >
            {/* Placeholder for thought text */}
          </BlurView>
        ) : (
          <View style={[styles.thoughtContainer, styles.androidBlur]}>
            {/* Placeholder for thought text */}
          </View>
        )}
      </Animated.View>
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
  imageContainer: {
    position: 'relative',
  },
  image: {
    resizeMode: 'contain',
  },
  thoughtContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    minHeight: 80,
    borderRadius: 20,
    padding: 15,
  },
  androidBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default PhotoResultScreen;