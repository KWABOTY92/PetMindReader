// src/screens/onboarding/FamilyContextScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../contexts/AppContext';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyContext'>;

function FamilyContextScreen({ navigation }: Props): JSX.Element {
  const { actions } = useApp();
  const [familyInfo, setFamilyInfo] = useState({
    ownerName: '',
    familyMembers: '',
  });

  const handleNext = () => {
    if (!familyInfo.ownerName) return;

    // Save user data
    actions.setUser({
      id: Date.now().toString(),
      name: familyInfo.ownerName,
      familyMembers: familyInfo.familyMembers
        .split(',')
        .map(name => name.trim())
        .filter(Boolean),
    });

    // Navigate to pet management
    navigation.navigate('PetManagement', {})
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '33%' }]} />
      </View>

      <Text style={styles.title}>First, Tell Us About Your Family!</Text>
      <Text style={styles.subtitle}>
        This helps us understand who's in your pets' daily life
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>What's your name?</Text>
        <TextInput
          style={styles.input}
          value={familyInfo.ownerName}
          onChangeText={(text) => setFamilyInfo(prev => ({ ...prev, ownerName: text }))}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Any other family members? (optional)</Text>
        <Text style={styles.hint}>Who else interacts with your pets daily?</Text>
        <TextInput
          style={styles.input}
          value={familyInfo.familyMembers}
          onChangeText={(text) => setFamilyInfo(prev => ({ ...prev, familyMembers: text }))}
          placeholder="Names, separated by commas"
        />
      </View>

      <Text style={styles.disclaimer}>
        Next, we'll set up profiles for all your pets!
      </Text>

      <Pressable 
        style={[
          styles.button,
          !familyInfo.ownerName && styles.buttonDisabled
        ]}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>Next: Add Your Pets</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 30,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  disclaimer: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FamilyContextScreen;