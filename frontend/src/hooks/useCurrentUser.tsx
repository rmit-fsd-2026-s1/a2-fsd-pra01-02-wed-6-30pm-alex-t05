import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserByUserName } from '../services/userService';
import { User } from '../types/user';

export const useCurrentUser = (): User | null => {
    const { user } = useAuth();
    const [fullUser, setFullUser] = useState<User | null>(null);
    
    useEffect(() => {
        if (!user) {
            setFullUser(null); // If there's no user, set fullUser to null
            return;
        }
        
        // If there's no user in the auth context, do nothing
        const fetchFullUser = async () => {
            const fetchedUser = await getUserByUserName(user.userName);
            setFullUser(fetchedUser);
        };
        fetchFullUser();
    }, [user]);

    return fullUser; // Get the full user details using the email (which is unique and non-editable)
}
//This hook is used to pull full user data from AuthContext