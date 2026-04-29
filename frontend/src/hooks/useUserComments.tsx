import { useAuth } from "../context/AuthContext";
import { getUserCommentsFromVendor } from "../services/userService";

export const useUserComments = (userName: string) => {
    const { user } = useAuth();
    //hook can only be called by logged in vendor, so user is guaranteed to exist
    return getUserCommentsFromVendor(userName, user!.userName);
}
//This hook pulls comments for a hirer by the vendor from the usernames