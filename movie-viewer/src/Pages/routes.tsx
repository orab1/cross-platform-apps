import Feed from "./AuthPages/Feed/Feed";
import { EvilIcons, Feather, FontAwesome, MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import Login from "./UnAuthPages/Login/Login";
import Register from "./UnAuthPages/Register/Register";
import AddNewReview from './AuthPages/AddNewReview/AddNewReview'
import HotMovies from "./AuthPages/Movies/HotMovies";
import Profile from "./AuthPages/Profile/Profile";

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
        component: HotMovies,
        tabBarIcon: ({ focused, ...props }: { color: string, size: number, focused: boolean }) =>
            focused ?
                <MaterialCommunityIcons name={'filmstrip-box'} {...props} /> :
                <FontAwesome name={"film"} {...props} />
    },
    {
        name: 'Feed',
        component: Feed,
        initialParams: { myPosts: false },
        tabBarIcon: ({ focused, ...props }: { color: string, size: number, focused: boolean }) =>
            focused ?
                <FontAwesome name={"feed"} {...props} /> :
                <SimpleLineIcons name={'feed'} {...props} />
    },
    {
        name: 'My Posts',
        component: Feed,
        initialParams: { myPosts: true },
        tabBarIcon: ({ focused, ...props }: { color: string, size: number, focused: boolean }) =>
            focused ?
                <FontAwesome name={'comment'} {...props} /> :
                <EvilIcons name={'comment'} {...props} />
    },
    {
        name: 'Profile',
        component: Profile,
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