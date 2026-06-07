import axios from "axios";
import { User } from "../types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Will need to add validations in the future.

export const authService = {
    loginUser: async (email: string, password: string): Promise<User> => {
        const { data } = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
        return data;
    }
}