import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { setUserInDB, getUserById, User } from '../Services/Users';
import { useCache } from './cache';

interface AuthContextType {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    user: User | null;
    register: (email: string, password: string, name: { first: string, last: string }, imageUri: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => new Promise(() => { }),
    logout: () => new Promise(() => { }),
    register: () => { }
});

export const AuthProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const { getImage } = useCache();
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        const { user } = await signInWithEmailAndPassword(getAuth(), email, password);
        setUser(await getUserById(user.uid));
    }

    const register = async (email: string, password: string, name: { first: string, last: string }, imageUri: string) => {
        const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
        await setUserInDB({ email, name, uId: user.uid, imageUri });
        setUser({ email, name, uId: user.uid, imageUri });
    }

    const logout = async () => {
        await getAuth().signOut();
        setUser(null);
    }

    const setUserImage = async () => {
        if (!user) return;

        const imageUri = await getImage(`${user.uId}`);
        setUser(oldUser => ({ ...oldUser, imageUri }) as User);
    }

    useEffect(() => {
        !user?.imageUri && setUserImage();
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);