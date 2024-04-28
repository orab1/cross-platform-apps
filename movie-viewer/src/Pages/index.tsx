import { ProgressBar } from "react-native-paper";
import { useAuth } from "../Providers/auth";
import { useLoading } from "../Providers/loading";
import AuthNavigator from "./AuthPages/AuthNavigator";
import UnAuthNavigator from "./UnAuthPages/UnAuthNavigator";
import { View } from "react-native";

const Pages = () => {
    const { user } = useAuth();

    return (
        <View style={{ flex: 1, height: '100%', width: '100%' }}>
            {user ?
                <AuthNavigator /> :
                <UnAuthNavigator />}
        </View>)
}

export default Pages