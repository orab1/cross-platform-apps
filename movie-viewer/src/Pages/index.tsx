import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import Feed from './Feed';
import { BottomNavigation } from 'react-native-paper';
import { Feather, FontAwesome, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';

const Tabs = createBottomTabNavigator();

const routes = [
    {
        name: 'Movies',
        component: Feed,
        tabBarIcon: ({ focused, ...props }: { color: string, size: number, focused: boolean }) =>
            focused ?
                <MaterialCommunityIcons name={'filmstrip-box'} {...props} /> :
                <FontAwesome name={"film"} {...props} />
    },
    {
        name: 'Feed',
        component: Feed,
        tabBarIcon: ({ focused, ...props }: { color: string, size: number, focused: boolean }) =>
            focused ?
                <FontAwesome name={"feed"} {...props} /> :
                <SimpleLineIcons name={'feed'} {...props} />
    },
    {
        name: 'Profile',
        component: Feed,
        tabBarIcon: ({ focused, ...props }: { color: string, size: number, focused: boolean }) =>
            focused ?
                <FontAwesome name={"user"} {...props} /> :
                <Feather name={'user'} {...props} />

    },
];


const Pages = () => {
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
                routes.map(({ tabBarIcon, name, component }) =>
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

export default Pages;
