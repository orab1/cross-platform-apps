import { useAuth } from "../Providers/auth";
import AuthNavigator from "./AuthNavigator";
import UnAuthNavigator from "./UnAuthNavigator";

const Pages = () => {
    const { user } = useAuth();
    
    return user ?
        <AuthNavigator /> :
        <UnAuthNavigator />
}

export default Pages