import { DEFAULT_USERS, User } from '../types/user';
import axios from 'axios';
const API_BASE_URL = "http://localhost:3001/api";
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

export function getUserCommentsFromVendor(userName: string, vendorUserName: string) : string {
    const user = getUserByUserName(userName);
    for (const comment of user!.vendorComments || []) {
        //comments are vendorUserName, comment. so match first part to vendorUsername then return comment
        if (comment[0] === vendorUserName) {
            return comment[1];
        }
    }
    return "";
}

//Setters
export const saveUser = (newUser: User) => {
    const existingData = getUsers();
    localStorage.setItem('users', JSON.stringify([...existingData, newUser]));
};

export const updateUser = (updatedUser: User) => {
    const existingData = getUsers();
    const updatedData = existingData.map((user: User) =>
        user.userName === updatedUser.userName ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedData));
}

export const checkDuplicate = (field: keyof User, value: string) => {
    const existingData = getUsers();
    return existingData.some((item: User) => item[field] === value);
};

export const authenticateUser = async (email: string, password: string) => {            
    const existingData = await getUsers();
    const user = existingData.find((user: User) => user.email === email && user.password === password);
    return user || null;
}

export function setUserCommentFromVendor(userName: string, vendorUserName: string, comment: string) : void {
    const user = getUserByUserName(userName);
    if (!user) return;
    for (const existingComment of user!.vendorComments || []) {
        //if comment from vendor already exists, update it
        if (existingComment[0] === vendorUserName) {
            existingComment[1] = comment;
            updateUser(user!);
            return;
        }
    }
    //if comment from vendor doesn't exist, add it;
    user!.vendorComments = user!.vendorComments || [];
    user!.vendorComments.push([vendorUserName, comment]);
    updateUser(user!);
}
