import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { userService } from "@/services/api";
import { User } from '@/types/user';

//bespoke type to restrict user data displayed in context
type AuthUser = {
    userName: string;
    email: string;
    role: string;
}

type AuthContextType = {
    user: AuthUser | null;
    login: (userData: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    //retrieves current user to persist login
    useEffect(() => {
        const StoredUser = localStorage.getItem('currentUser'); // Checks if there is a logged in user
        if (StoredUser) setUser(JSON.parse(StoredUser)); // If there is a logged in user, set the user state to that user
    }, []);

    const login = (userData: AuthUser) => {
        //sets authcontext to passed in user data and also stores it in local storage to persist login
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    //provider
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}