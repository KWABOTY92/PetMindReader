// src/screens/onboarding/FamilyContextScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../contexts/AppContext';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyContext'>;

function FamilyContextScreen({ navigation, route }: Props): JSX.Element {
  const { state, actions } = useApp();
  const isEditing = state.user !== null;
  
  const [familyInfo, setFamilyInfo] = useState({
    ownerName: '',
    familyMembers: '',
  });

  useEffect(() => {
    if (state.user) {
      setFamilyInfo({
        ownerName: state.user.name,
        familyMembers: state.user.familyMembers?.join(', ') || '',
      });
    }
  }, [state.user]);

  const handleSave = () => {
    if (!familyInfo.ownerName) return;

    // Save user data
    actions.setUser({
      id: state.user?.id || Date.now().toString(),
      name: familyInfo.ownerName,
      familyMembers: familyInfo.familyMembers
        .split(',')
        .map(name => name.trim())
        .filter(Boolean),
    });

    if (isEditing) {
      navigation.goBack();
    } else {
      // Navigate to pet management during onboarding
      navigation.navigate('PetManagement', {});
    }
  };

  return (
    <ScrollView style={styles.container}>
      {!isEditing && (
        <>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>

          <Text style={styles.title}>First, Tell Us About Your Magical Circle!</Text>
          <Text style={styles.subtitle}>
            This helps us understand who shares in the magic of your pets' daily life
          </Text>
        </>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>What shall we call you?</Text>
        <TextInput
          style={styles.input}
          value={familyInfo.ownerName}
          onChangeText={(text) => setFamilyInfo(prev => ({ ...prev, ownerName: text }))}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Who else shares in the magic? (optional)</Text>
        <Text style={styles.hint}>Other humans who bring joy to your pets' lives</Text>
        <TextInput
          style={styles.input}
          value={familyInfo.familyMembers}
          onChangeText={(text) => setFamilyInfo(prev => ({ ...prev, familyMembers: text }))}
          placeholder="Names, separated by commas"
        />
      </View>

      {!isEditing && (
        <Text style={styles.disclaimer}>
          Next, we'll create profiles for your magical companions!
        </Text>
      )}

      <Pressable 
        style={[
          styles.button,
          !familyInfo.ownerName && styles.buttonDisabled
        ]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>
          {isEditing ? 'Save Changes' : 'Next: Add Your Pets'}
        </Text>
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