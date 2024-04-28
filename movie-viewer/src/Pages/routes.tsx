import Feed from "./AuthPages/Feed";
import { Feather, FontAwesome, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import Login from "./UnAuthPages/Login/Login";
import Register from "./UnAuthPages/Register/Register";
import AddNewReview from './AuthPages/AddNewReview/AddNewReview'

export const authStackRoutes = [

    {
        name: 'AddNewReview',
        component: AddNewReview,
        showInTabs: false,
    },
]

export const authTabRoutes = [
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

export const unAuthRoutes = [
    {
        name: 'Login',
        component: Login,
    },
    {
        name: 'Register',
        component: Register,
    },
]