import { useAuth } from '../context/AuthContext';
import { getUserByUserName } from '../services/userService';
import { User } from '../types/user';

export const useCurrentUser = (): User | null => {
    const { user } = useAuth();
    if (!user) return null;
    return getUserByUserName(user.userName); // Get the full user details using the email (which is unique and non-editable)
}
//This hook is used to pull full user data from AuthContext