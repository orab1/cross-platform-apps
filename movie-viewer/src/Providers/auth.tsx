import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import React, { createContext, ReactNode, useState } from 'react';
import { auth } from '../Services/firebse';

interface AuthContextType {
    login: (email: string, password: string) => void;
    logout?: () => void;
    user?: User | null;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
});


export const AuthProvider: React.FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        setUser(user);
    }

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);