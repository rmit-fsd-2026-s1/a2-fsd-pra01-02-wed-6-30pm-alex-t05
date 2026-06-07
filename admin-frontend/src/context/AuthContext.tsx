import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { AdminService } from "@/services/api";

type AuthUser = {
    userName: string;
    password: string;
}

type AuthContextType = {
    admin: AuthUser | null;
    admins: AuthUser[];
    login: (userData: AuthUser) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [admin, setAdmin] = useState<AuthUser | null>(null);
    const [admins, setAdmins] = useState<AuthUser[]>([]);
    //retrieves current user to persist login
    useEffect(() => {
        fetchAdmins();
        const StoredUser = localStorage.getItem('currentAdmin'); // Checks if there is a logged in user
        if (StoredUser) setAdmin(JSON.parse(StoredUser)); // If there is a logged in user, set the user state to that user
    }, []);

    const fetchAdmins = async () => {
        try {
            const data = await AdminService.getAllAdmins();
            setAdmins(data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        }
    };


    const login = (adminData: AuthUser): boolean => {
        const foundUser = admins.find(
            (admin) => admin.userName === adminData.userName && admin.password === adminData.password
        );

        if (foundUser) {
            setAdmin(foundUser);
            localStorage.setItem('currentAdmin', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem('currentAdmin');
    };

    return (
        <AuthContext.Provider value={{ admin, admins, login, logout }}>
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
};
