import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { unAuthRoutes } from './routes';

const Stack = createNativeStackNavigator();

const UnAuthNavigator = () =>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {unAuthRoutes.map(({ name, component }) => (
            <Stack.Screen key={name} name={name} component={component} />
        ))}
    </Stack.Navigator>


export default UnAuthNavigator;