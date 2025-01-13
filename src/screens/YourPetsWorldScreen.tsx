// src/screens/YourPetsWorldScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../contexts/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'YourPetsWorld'>;

function YourPetsWorldScreen({ navigation }: Props): JSX.Element {
  const { state } = useApp();
  const { user, pets } = state;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Magical Companions</Text>
        <Text style={styles.sectionSubtitle}>
          {pets.length === 0 
            ? "No magical companions yet!" 
            : `${pets.length} magical companion${pets.length > 1 ? 's' : ''}`}
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('PetManagement', {})}
        >
          <Text style={styles.buttonText}>
            {pets.length === 0 ? 'Add Your First Pet' : 'Manage Companions'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Their Human Circle</Text>
        <Text style={styles.sectionSubtitle}>
          {user?.familyMembers?.length 
            ? `${user.familyMembers.length + 1} humans in the circle` 
            : 'Just you in the circle'}
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('FamilyContext')}
        >
          <Text style={styles.buttonText}>Manage Circle</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    marginBottom: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: '#007AFF',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
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

export default YourPetsWorldScreen;