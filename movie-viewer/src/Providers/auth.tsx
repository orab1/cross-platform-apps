import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, User } from 'firebase/auth';
import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { createUserInDB } from '../Services/Users';

interface AuthContextType {
    login: (email: string, password: string) => void;
    logout?: () => void;
    user: User | null;
    register: (email: string, password: string, name: { first: string, last: string }, imageUri: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    register: () => { }
});


export const AuthProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {        
        const { user } = await signInWithEmailAndPassword(getAuth(), email, password);
        setUser(user);
    }

    const register = async (email: string, password: string, name: { first: string, last: string }, imageUri: string) => {
        const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
        await createUserInDB({ email, name, uId: user.uid, imageUri });
        setUser(user);
    }

    return (
        <AuthContext.Provider value={{ user, login, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);