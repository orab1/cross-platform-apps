import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import { BottomNavigation } from 'react-native-paper';
import { authRoutes } from './routes';

const Tabs = createBottomTabNavigator();


const AuthNavigator = () => {
    return (
        <Tabs.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={({ navigation, state, descriptors, insets }) => (
                <BottomNavigation.Bar
                    navigationState={state}
                    safeAreaInsets={insets}
                    onTabPress={({ route, preventDefault }) => {
                        preventDefault();
                        navigation.navigate(route.name, route.params);
                    }}

                    renderIcon={({ route: { key }, focused, color }) => {
                        const { options: { tabBarIcon } } = descriptors[key];

                        return tabBarIcon && tabBarIcon({ focused, color, size: 24 });
                    }}

                    getLabelText={({ route }) => {
                        const { options: { tabBarLabel } } = descriptors[route.key];

                        return tabBarLabel ? tabBarLabel : route.name;
                    }}
                />
            )}
        >
            {
                authRoutes.map(({ tabBarIcon, name, component }) =>
                    <Tabs.Screen
                        key={name}
                        component={component}
                        name={name}
                        options={{
                            tabBarIcon,
                            tabBarLabel: name
                        }} />)
            }
        </Tabs.Navigator >
    )
}

export default AuthNavigator;
