import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { userService } from "@/services/api";
import { User } from '@/types/user';
import { authService } from '@/services/loginapi';

//bespoke type to restrict user data displayed in context
type AuthUser = {
    userName: string;
    email: string;
    role: string;
}

type login = {
    userName: string;
    password: string;
}

type AuthContextType = {
    user: AuthUser | null;
    login: (userName: string, password: string) => void;
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

    const login = async (userName: string, password: string) => {
        try {
            const data = await authService.loginUser(userName, password);
            const userData: AuthUser = {
                userName: data.userName,
                email: data.email,
                role: data.role
            }
            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
        } catch (error) {
            console.error("Login failed:", error);
        }
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