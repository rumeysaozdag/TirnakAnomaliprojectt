import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import AnomalyTypes from './screens/AnomalyTypes';
import CameraScreen from './screens/CameraScreen';
import Info from './screens/Info';
import ResultScreen from './screens/ResultScreen';
import AnomalyDetails from './screens/AnomalyDetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="AnomalyTypes" component={AnomalyTypes} />
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
        <Stack.Screen name="AnomalyDetails" component={AnomalyDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
