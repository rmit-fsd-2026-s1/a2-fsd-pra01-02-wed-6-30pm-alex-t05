import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { HistoryReputation } from "../types/user";

type AuthUser = {
    userName: string;
    email: string;
    role: string;
    historyReputation?: HistoryReputation[]
}

type AuthContextType = {
    user: AuthUser | null;
    login: (userData: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);


    const login = (userData: AuthUser) => {
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
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}