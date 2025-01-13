// src/screens/onboarding/PetDetailsScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
  const { petId, fromOnboarding } = route.params;
  const editingPet = petId ? state.pets.find(p => p.id === petId) : null;

  const [petInfo, setPetInfo] = useState({
    name: '',
    type: '',
    breed: '',
    customTraits: '',
    quirks: '',
    favoriteThings: '',
  });

  const [suggestedTraits, setSuggestedTraits] = useState<PersonalityTrait[]>(DEFAULT_TRAITS);
  const [isSaving, setIsSaving] = useState(false);

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

      if (editingPet.traits?.suggested) {
        setSuggestedTraits(DEFAULT_TRAITS.map(trait => ({
          ...trait,
          selected: editingPet.traits!.suggested.includes(trait.label),
        })));
      }
    }
  }, [editingPet]);

  const toggleTrait = useCallback((id: string) => {
    setSuggestedTraits(prev => prev.map(trait =>
      trait.id === id ? { ...trait, selected: !trait.selected } : trait
    ));
  }, []);

  const validatePetInfo = useCallback(() => {
    if (!petInfo.name.trim()) {
      Alert.alert('Missing Information', 'Please enter your pet\'s name.');
      return false;
    }
    if (!petInfo.type.trim()) {
      Alert.alert('Missing Information', 'Please specify what kind of pet they are.');
      return false;
    }
    return true;
  }, [petInfo]);

  const handleSave = useCallback(async () => {
    if (!validatePetInfo() || isSaving) return;

    try {
      setIsSaving(true);

      const pet = {
        id: petId || `pet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: petInfo.name.trim(),
        type: petInfo.type.trim(),
        breed: petInfo.breed.trim() || undefined,
        traits: {
          suggested: suggestedTraits.filter(t => t.selected).map(t => t.label),
          custom: petInfo.customTraits.split(',').map(t => t.trim()).filter(Boolean),
        },
        quirks: petInfo.quirks.trim() || undefined,
        favoriteThings: petInfo.favoriteThings.trim() || undefined,
      };
      
      if (petId) {
        await actions.updatePet(pet);
      } else {
        await actions.addPet(pet);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving pet:', error);
      Alert.alert(
        'Error',
        'There was a problem saving your pet\'s information. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  }, [petInfo, suggestedTraits, petId, actions, navigation, validatePetInfo, isSaving]);

  const handleDelete = useCallback(() => {
    if (!petId) return;

    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${petInfo.name}'s profile? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await actions.deletePet(petId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting pet:', error);
              Alert.alert('Error', 'Failed to delete pet. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  }, [petId, petInfo.name, actions, navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {editingPet ? `Edit ${petInfo.name}'s Profile` : 'Add a New Pet'}
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
            editable={!isSaving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>What kind of pet are they?</Text>
          <TextInput
            style={styles.input}
            value={petInfo.type}
            onChangeText={(text) => setPetInfo(prev => ({ ...prev, type: text }))}
            placeholder="e.g., Cat, Dog, etc."
            editable={!isSaving}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Breed (optional)</Text>
          <TextInput
            style={styles.input}
            value={petInfo.breed}
            onChangeText={(text) => setPetInfo(prev => ({ ...prev, breed: text }))}
            placeholder="e.g., Persian, Golden Retriever"
            editable={!isSaving}
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
              style={[
                styles.traitButton, 
                trait.selected && styles.traitSelected,
                isSaving && styles.disabled
              ]}
              onPress={() => toggleTrait(trait.id)}
              disabled={isSaving}
            >
              <Text style={[
                styles.traitText, 
                trait.selected && styles.traitTextSelected,
                isSaving && styles.disabledText
              ]}>
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
            editable={!isSaving}
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
            editable={!isSaving}
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
            editable={!isSaving}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable 
          style={[
            styles.button,
            (!petInfo.name || !petInfo.type || isSaving) && styles.buttonDisabled
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? 'Saving...' : (editingPet ? 'Save Changes' : 'Add Pet')}
          </Text>
        </Pressable>

        {editingPet && (
          <Pressable 
            style={[styles.deleteButton, isSaving && styles.buttonDisabled]}
            onPress={handleDelete}
            disabled={isSaving}
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
    backgroundColor: '#fff',
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
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default PetDetailsScreen;