import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText';

// Only import MapView for native platforms
const MapView = Platform.select({
  native: () => require('react-native-maps').default,
  default: () => View,
})();

const Marker = Platform.select({
  native: () => require('react-native-maps').Marker,
  default: () => View,
})();

const MapScreen = () => {
  const [homeLocation, setHomeLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadHomeLocation();
  }, []);

  const loadHomeLocation = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem('homeLocation');
      if (savedLocation) {
        setHomeLocation(prev => ({
          ...prev,
          ...JSON.parse(savedLocation)
        }));
      }
    } catch (error) {
      console.error('Error loading home location:', error);
    }
  };

  const setNewHomeLocation = async (latitude: number, longitude: number) => {
    const newLocation = { latitude, longitude };
    try {
      await AsyncStorage.setItem('homeLocation', JSON.stringify(newLocation));
      setHomeLocation(prev => ({
        ...prev,
        ...newLocation
      }));
    } catch (error) {
      console.error('Error saving home location:', error);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <ThemedText>
          Maps are currently only supported on iOS and Android devices.
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={homeLocation}
        onLongPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setNewHomeLocation(latitude, longitude);
        }}
      >
        <Marker
          coordinate={{
            latitude: homeLocation.latitude,
            longitude: homeLocation.longitude,
          }}
          title="Home Location"
          description="Long press anywhere on the map to change"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  map: {
    flex: 1,
    width: '100%',
  },
});

export default MapScreen;
