// src/screens/setup/PetManagementScreen.tsx
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { useApp } from '../../contexts/AppContext';
import type { MainStackParamList } from '../../navigation/MainStack';
import type { Pet } from '../../contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'PetManagement'>;
type RouteProps = RouteProp<MainStackParamList, 'PetManagement'>;

interface Props {
  navigation: NavigationProp;
  route: RouteProps;
}

function PetManagementScreen({ navigation, route }: Props): JSX.Element {
  const { state, actions } = useApp();
  const { pets } = state;
  const isSetup = route.params?.fromSetup;

  const handleAddPet = useCallback(() => {
    navigation.navigate('PetDetails', { 
      petId: null,
      fromSetup: isSetup 
    });
  }, [navigation, isSetup]);

  const handleEditPet = useCallback((petId: string) => {
    navigation.navigate('PetDetails', { 
      petId,
      fromSetup: isSetup 
    });
  }, [navigation, isSetup]);

  const handleComplete = useCallback(async () => {
    if (isSetup) {
      // Mark setup as complete and navigate to Home
      await AsyncStorage.setItem('@setup_complete', 'true');
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
  }, [navigation, isSetup]);

  const handleDeletePet = useCallback((petId: string, petName: string) => {
    Alert.alert(
      'Remove Companion',
      `Are you sure you want to remove ${petName} from your magical circle?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => actions.deletePet(petId),
          style: 'destructive'
        }
      ]
    );
  }, [actions]);

  const renderRightActions = useCallback((petId: string, petName: string) => {
    return (
      <Pressable 
        style={styles.deleteAction}
        onPress={() => handleDeletePet(petId, petName)}
      >
        <Text style={styles.deleteActionText}>Remove</Text>
      </Pressable>
    );
  }, [handleDeletePet]);

  const renderPetCard = useCallback(({ item: pet }: { item: Pet }) => (
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
  ), [handleEditPet, renderRightActions]);

  const EmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        No companions added yet. Tap the button below to add your first magical friend!
      </Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      {isSetup && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>
          {isSetup ? 'Your Magical Companions' : 'Manage Your Companions'}
        </Text>
        {isSetup && (
          <Text style={styles.subtitle}>
            Add profiles for all your furry friends!
          </Text>
        )}
      </View>

      <FlatList
        data={pets}
        renderItem={renderPetCard}
        keyExtractor={pet => pet.id}
        extraData={pets.length}
        contentContainerStyle={styles.petList}
        ListEmptyComponent={EmptyState}
      />

      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.addButton}
          onPress={handleAddPet}
        >
          <Text style={styles.buttonText}>
            {pets.length === 0 ? 'Add Your First Companion' : 'Add Another Companion'}
          </Text>
        </Pressable>

        {(pets.length > 0 || !isSetup) && (
          <Pressable 
            style={[styles.completeButton, !isSetup && styles.doneButton]}
            onPress={handleComplete}
          >
            <Text style={styles.buttonText}>
              {isSetup ? 'Complete Setup' : 'Done'}
            </Text>
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
  doneButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PetManagementScreen;