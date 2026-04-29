import { DEFAULT_USERS, User } from '../types/user';

export const getUsers = (): User[] => {
    const checkStoredUsers = localStorage.getItem('users'); // Get existing users from localStorage, if not found return an empty array
    if (!checkStoredUsers) {
        localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
        return [...DEFAULT_USERS];
    }
    const storedUsers = JSON.parse(checkStoredUsers); // Get existing users from localStorage, if not found return an empty array
        
    return storedUsers;
};

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

export const authenticateUser = (email: string, password: string) => {            
    const existingData = getUsers();
    const user = existingData.find((user: User) => user.email === email && user.password === password);
    return user || null;
}

export const getUserByEmail = (email: string): User | null => {
    const existingData = getUsers();
    const user = existingData.find((user: User) => user.email === email);
    return user || null;
}

export const getUserByUserName = (userName: string): User | null => {
    const existingData = getUsers();
    const user = existingData.find((user: User) => user.userName === userName);
    return user || null;
}