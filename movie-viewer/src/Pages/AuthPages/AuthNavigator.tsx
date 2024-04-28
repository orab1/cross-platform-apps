import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FC } from 'react'
import { BottomNavigation } from 'react-native-paper';
import { authTabRoutes } from '../routes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddNewReview from './AddNewReview/AddNewReview';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabsNavigator: FC = () =>
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

                    return tabBarLabel ? tabBarLabel : undefined;
                }}
            />
        )}
    >
        {
            authTabRoutes.map(({ tabBarIcon = undefined, name, component }) =>
                <Tabs.Screen
                    key={name}
                    component={component}
                    name={name}
                    options={{
                        tabBarIcon,
                        tabBarLabel: name,
                    }} />)
        }
    </Tabs.Navigator>

const AuthNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='AddNewReview'>
            <Stack.Screen
                name={'Tabs'}
                component={TabsNavigator}
            />
            <Stack.Screen
                name={'AddNewReview'}
                component={AddNewReview}
            />
        </Stack.Navigator>
    )
}

export default AuthNavigator;
