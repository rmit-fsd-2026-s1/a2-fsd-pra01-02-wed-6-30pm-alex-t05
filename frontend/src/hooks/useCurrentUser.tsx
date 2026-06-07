import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types/user';
import { userService } from '../services/api';

export const useCurrentUser = (): User | null => {
    const { user } = useAuth();
    const [fullUser, setFullUser] = useState<User | null>(null);
    //updates full user details whenever the user in AuthContext changes, and handles the data being async
    useEffect(() => {
        if (!user) {
            setFullUser(null); //if there's no user, set fullUser to null
            return;
        }
            const fetchFullUser = async () => {
            const fetchedUser = await userService.getOneUser(user.userName);
            setFullUser(fetchedUser);
        };
        fetchFullUser();
    }, [user]);

    return fullUser; //get the full user details using the username (which is unique and non-editable)
}
//This hook is used to pull full user data from the username in AuthContext