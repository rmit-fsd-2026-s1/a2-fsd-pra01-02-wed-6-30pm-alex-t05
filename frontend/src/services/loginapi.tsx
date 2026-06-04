import axios from "axios";
import { Event } from "../types/event";
import { User } from "../types/user";

const API_BASE_URL = "http://localhost:3001/api";

// Will need to add validations in the future.

export const authService = {
    loginUser: async (userName: string, password: string): Promise<User> => {
        const { data } = await axios.post(`${API_BASE_URL}/login`, { userName, password });
        return data;
    }
}