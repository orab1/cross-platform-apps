import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { FC } from 'react'
import { BottomNavigation, FAB } from 'react-native-paper';
import { authTabRoutes } from '../routes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddNewReview from './AddNewReview/AddNewReview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabsNavigator: FC = () => {
    const { right, bottom } = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <>
            <Tabs.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName='Feed'
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
                    authTabRoutes.map(({ tabBarIcon = undefined, name, component, initialParams = undefined }) =>
                        <Tabs.Screen
                            key={name}
                            component={component}
                            name={name}
                            initialParams={initialParams}
                            options={{
                                tabBarIcon,
                                tabBarLabel: name,
                            }} />)
                }
            </Tabs.Navigator>
            <FAB
                icon='plus'
                onPress={() => navigation.navigate('AddNewReview')}
                style={{
                    position: 'absolute',
                    bottom: bottom + 100,
                    right: right + 5,
                }} />
        </>)
}

const AuthNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Tabs'>
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
