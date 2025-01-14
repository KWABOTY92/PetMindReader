// src/screens/PhotoResultScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  Text,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { useApp } from '../contexts/AppContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { MainStackParamList } from '../navigation/MainStack';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'PhotoResult'>;
type RouteProps = RouteProp<MainStackParamList, 'PhotoResult'>;

function PhotoResultScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { photoUri, width, height } = route.params;
  const { state } = useApp();
  const [imageLayout, setImageLayout] = useState({ width: 0, height: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const thoughtsAnim = useRef(new Animated.Value(0)).current;

  // Placeholder thought remains the same
  const [thought] = useState(
    "Oh, the things I could tell you about what's going on in my human's head right now... 😏"
  );

  useEffect(() => {
    // Layout calculation stays the same
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

    // Animations stay the same
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(thoughtsAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [width, height, fadeAnim, thoughtsAnim]);

  const handleTakeAnother = () => {
    navigation.navigate('Home');
  };

  // Platform-specific ThoughtBubble component remains the same
  const ThoughtBubble = Platform.select({
    ios: () => (
      <BlurView
        style={[styles.thoughtContainer, { opacity: thoughtsAnim }]}
        blurType="light"
        blurAmount={10}
      >
        <Text style={styles.thoughtText}>{thought}</Text>
      </BlurView>
    ),
    android: () => (
      <Animated.View
        style={[
          styles.thoughtContainer,
          styles.androidBlur,
          { opacity: thoughtsAnim }
        ]}
      >
        <Text style={styles.thoughtText}>{thought}</Text>
      </Animated.View>
    ),
  })!;

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
        <ThoughtBubble />
      </Animated.View>

      <Pressable 
        style={styles.anotherButton}
        onPress={handleTakeAnother}
      >
        <Text style={styles.buttonText}>Capture Another Moment</Text>
      </Pressable>
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
    justifyContent: 'center',
  },
  androidBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  thoughtText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  anotherButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PhotoResultScreen;