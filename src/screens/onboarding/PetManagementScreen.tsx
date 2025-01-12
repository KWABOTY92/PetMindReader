// src/screens/onboarding/PetManagementScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, FlatList, Alert } from 'react-native';
import type { Pet } from '../../contexts/AppContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../contexts/AppContext';
import type { RootStackParamList } from '../../types/navigation';
import { Swipeable } from 'react-native-gesture-handler';

type Props = NativeStackScreenProps<RootStackParamList, 'PetManagement'>;

function PetManagementScreen({ navigation, route }: Props): JSX.Element {
  const { state, actions } = useApp();
  const { pets } = state;

  const handleAddPet = () => {
    navigation.navigate('PetDetails', { petId: null });
  };

  const handleEditPet = (petId: string) => {
    navigation.navigate('PetDetails', { petId });
  };

  const handleComplete = async () => {
    if (route.params?.onComplete) {
      await route.params.onComplete();
    }
  };

  const handleDeletePet = (petId: string, petName: string) => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to remove ${petName} from your pets?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => actions.deletePet(petId),
          style: 'destructive'
        }
      ]
    );
  };

  const renderRightActions = (petId: string, petName: string) => {
    return (
      <Pressable 
        style={styles.deleteAction}
        onPress={() => handleDeletePet(petId, petName)}
      >
        <Text style={styles.deleteActionText}>Delete</Text>
      </Pressable>
    );
  };

  const renderPetCard = ({ item: pet }: { item: Pet }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(pet.id, pet.name)}
      rightThreshold={40}
    >
      <Pressable
        style={styles.petCard}
        onPress={() => handleEditPet(pet.id)}
      >
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petType}>
            {pet.type}{pet.breed ? ` • ${pet.breed}` : ''}
          </Text>
          {pet.traits && (
            <Text style={styles.petTraits}>
              {[...pet.traits.suggested, ...pet.traits.custom].slice(0, 3).join(', ')}
              {pet.traits.suggested.length + pet.traits.custom.length > 3 ? '...' : ''}
            </Text>
          )}
        </View>
        <Text style={styles.editText}>Edit</Text>
      </Pressable>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '66%' }]} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Your Pets</Text>
        <Text style={styles.subtitle}>
          Add profiles for all your furry friends!
        </Text>
      </View>

      <FlatList
        data={pets}
        renderItem={renderPetCard}
        keyExtractor={pet => pet.id}
        extraData={pets.length}
        removeClippedSubviews={false}
        contentContainerStyle={styles.petList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No pets added yet. Tap the button below to add your first pet!
            </Text>
          </View>
        }
      />

      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.addButton}
          onPress={handleAddPet}
        >
          <Text style={styles.buttonText}>Add a Pet</Text>
        </Pressable>

        {pets.length > 0 && (
          <Pressable 
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <Text style={styles.buttonText}>Continue to App</Text>
          </Pressable>
        )}
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  petList: {
    flexGrow: 1,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  petType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  petTraits: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  editText: {
    color: '#007AFF',
    fontSize: 16,
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#34C759',
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

export default PetManagementScreen;