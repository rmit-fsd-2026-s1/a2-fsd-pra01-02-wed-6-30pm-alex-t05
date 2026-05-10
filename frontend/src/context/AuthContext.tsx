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
    users: User[];
    login: (userData: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<AuthUser | null>(null);
    //retrieves current user to persist login
    // Fetch profiles on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

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
        <AuthContext.Provider value={{ user, users, login, logout }}>
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