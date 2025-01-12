// src/screens/onboarding/PetDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../contexts/AppContext';
import type { RootStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PetDetails'>;

interface PersonalityTrait {
  id: string;
  label: string;
  selected: boolean;
}

const DEFAULT_TRAITS: PersonalityTrait[] = [
  { id: '1', label: 'Loving', selected: false },
  { id: '2', label: 'Independent', selected: false },
  { id: '3', label: 'Playful', selected: false },
  { id: '4', label: 'Shy', selected: false },
  { id: '5', label: 'Energetic', selected: false },
  { id: '6', label: 'Lazy', selected: false },
  { id: '7', label: 'Curious', selected: false },
  { id: '8', label: 'Mischievous', selected: false },
];

function PetDetailsScreen({ navigation, route }: Props): JSX.Element {
  const { state, actions } = useApp();
  const editingPetId = route.params?.petId;
  const editingPet = editingPetId ? state.pets.find(p => p.id === editingPetId) : null;

  const [petInfo, setPetInfo] = useState({
    name: '',
    type: '',
    breed: '',
    customTraits: '',
    quirks: '',
    favoriteThings: '',
  });

  const [suggestedTraits, setSuggestedTraits] = useState<PersonalityTrait[]>(DEFAULT_TRAITS);

  useEffect(() => {
    if (editingPet) {
      setPetInfo({
        name: editingPet.name,
        type: editingPet.type,
        breed: editingPet.breed || '',
        customTraits: editingPet.traits?.custom.join(', ') || '',
        quirks: editingPet.quirks || '',
        favoriteThings: editingPet.favoriteThings || '',
      });

      // Set selected traits
      if (editingPet.traits?.suggested) {
        setSuggestedTraits(DEFAULT_TRAITS.map(trait => ({
          ...trait,
          selected: editingPet.traits!.suggested.includes(trait.label),
        })));
      }
    }
  }, [editingPet]);

  const toggleTrait = (id: string) => {
    setSuggestedTraits(prev => prev.map(trait =>
      trait.id === id ? { ...trait, selected: !trait.selected } : trait
    ));
  };

  const handleSave = () => {
    console.log('HandleSave triggered');
    if (!petInfo.name || !petInfo.type) {
      console.log('Missing required fields:', { name: petInfo.name, type: petInfo.type });
      return;
    }

    const pet = {
      id: editingPetId || `pet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: petInfo.name,
      type: petInfo.type,
      breed: petInfo.breed || undefined,
      traits: {
        suggested: suggestedTraits.filter(t => t.selected).map(t => t.label),
        custom: petInfo.customTraits.split(',').map(t => t.trim()).filter(Boolean),
      },
      quirks: petInfo.quirks || undefined,
      favoriteThings: petInfo.favoriteThings || undefined,
    };

    console.log('Pet object created:', pet);
    
    if (editingPetId) {
      console.log('Updating existing pet');
      actions.updatePet(pet);
    } else {
      console.log('Adding new pet');
      actions.addPet(pet);
    }

    console.log('Navigating back');
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${petInfo.name}'s profile? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            actions.deletePet(editingPetId!);
            navigation.goBack();
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {editingPetId ? `Edit ${petInfo.name}'s Profile` : 'Add a New Pet'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>What's their name?</Text>
          <TextInput
            style={styles.input}
            value={petInfo.name}
            onChangeText={(text) => setPetInfo(prev => ({ ...prev, name: text }))}
            placeholder="Enter pet's name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>What kind of pet are they?</Text>
          <TextInput
            style={styles.input}
            value={petInfo.type}
            onChangeText={(text) => setPetInfo(prev => ({ ...prev, type: text }))}
            placeholder="e.g., Cat, Dog, etc."
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Breed (optional)</Text>
          <TextInput
            style={styles.input}
            value={petInfo.breed}
            onChangeText={(text) => setPetInfo(prev => ({ ...prev, breed: text }))}
            placeholder="e.g., Persian, Golden Retriever"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personality & Preferences</Text>
        
        <Text style={styles.label}>Personality Traits</Text>
        <Text style={styles.hint}>Tap any that fit:</Text>
        <View style={styles.traitsContainer}>
          {suggestedTraits.map(trait => (
            <Pressable
              key={trait.id}
              style={[styles.traitButton, trait.selected && styles.traitSelected]}
              onPress={() => toggleTrait(trait.id)}
            >
              <Text style={[styles.traitText, trait.selected && styles.traitTextSelected]}>
                {trait.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Traits</Text>
          <Text style={styles.hint}>Add your own traits, separated by commas</Text>
          <TextInput
            style={styles.input}
            value={petInfo.customTraits}
            onChangeText={(text) => setPetInfo(prev => ({ ...prev, customTraits: text }))}
            placeholder="e.g., dramatic, food-obsessed, gentle"
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>What makes them unique?</Text>
          <Text style={styles.hint}>Any quirks or special behaviors?</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={petInfo.quirks}
            onChangeText={(text) => setPetInfo(prev => ({ ...prev, quirks: text }))}
            placeholder="e.g., always sleeps in the sink, follows me to the bathroom"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>What do they love?</Text>
          <Text style={styles.hint}>Favorite activities, treats, or spots?</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={petInfo.favoriteThings}
            onChangeText={(text) => setPetInfo(prev => ({ ...prev, favoriteThings: text }))}
            placeholder="e.g., chasing laser dots, belly rubs, tuna treats"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.button, (!petInfo.name || !petInfo.type) && styles.buttonDisabled]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>
            {editingPetId ? 'Save Changes' : 'Add Pet'}
          </Text>
        </Pressable>

        {editingPetId && (
          <Pressable 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete Pet</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#007AFF',
  },
  inputGroup: {
    marginBottom: 20,
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
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  traitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  traitSelected: {
    backgroundColor: '#007AFF',
  },
  traitText: {
    color: '#007AFF',
    fontSize: 16,
  },
  traitTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PetDetailsScreen;