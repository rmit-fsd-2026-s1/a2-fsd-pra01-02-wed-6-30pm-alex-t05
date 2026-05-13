import { User } from '../types/user';
import axios from 'axios';
const API_BASE_URL = "http://localhost:3001/api";

//TODO refactor this to api.tsx
//Getters
export const getUsers = async (): Promise<User[]> => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/users`);
        return data;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return [];
    };
};
export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const users = await getUsers();
        return users.find((user: User) => user.email === email) || null;
    }
    catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
}

export const getUserByUserName = async (userName: string): Promise<User | null> => {
    try {
        const users = await getUsers();
        return users.find((user: User) => user.userName === userName) || null;
    }
    catch (error) {
        console.error("Error fetching user by username:", error);
        return null;
    }    
}

export async function getUserCommentsFromVendor(vendorUserName: string, hirerUserName: string) : Promise<string> {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/users/${vendorUserName}/comments/${hirerUserName}`);
        console.log("Fetched comments:", data);
        return data.comment;
    } catch (error) {
        //Reference: AI code generation - if no comment is found, we return an empty string and log a warning instead of an error
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            console.warn(`No comment found from vendor ${vendorUserName} for user ${hirerUserName}`);
            return "";
        }
        console.error("Error fetching user comments from vendor:", error);
        return "";
    }
}

export async function setUserCommentFromVendor(vendorUserName: string, hirerUserName: string, comment: string) : Promise<void> {
    try {
        await axios.post(`${API_BASE_URL}/users/${vendorUserName}/comments/${hirerUserName}`, { comment });
    } catch (error) {
        console.error("Error setting user comment from vendor:", error);
    }
}

export async function deleteUserCommentFromVendor(vendorUserName: string, hirerUserName: string) : Promise<void> {
    try {
        await axios.delete(`${API_BASE_URL}/users/${vendorUserName}/comments/${hirerUserName}`);
    } catch (error) {
        console.error("Error deleting user comment from vendor:", error);
    }
}

//Setters
export const updateUser = async (updatedUser: User) => {
    //sends put request with updated user
    try {
    await axios.put(`${API_BASE_URL}/users/${updatedUser.userName}`, updatedUser)
    return true;
    } catch (error) {
        console.error("Error updating user:", error);
        return false;
    }
};

export const authenticateUser = async (email: string, password: string) => {            
    const existingData = await getUsers();
    const user = existingData.find((user: User) => user.email === email && user.password === password);
    return user || null;
}


// Below here should be defunct but check if anything breaks if theyre gone

export const saveUser = (newUser: User) => {
    const existingData = getUsers();
    localStorage.setItem('users', JSON.stringify([...existingData, newUser]));
};



export const checkDuplicate = (field: keyof User, value: string) => {
    const existingData = getUsers();
    return existingData.some((item: User) => item[field] === value);
};




