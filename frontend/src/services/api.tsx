import axios from "axios";
import { Event } from "../types/event";

const API_BASE_URL = "http://localhost:3001/api";

export const eventService = {
    getAllEvents: async (): Promise<Event[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/events`);
        return data;
    },

    getEvent: async (id: string): Promise<Event> => {
        const { data } = await axios.get(`${API_BASE_URL}/events/${id}`);
        return data;
    },

    // Will allow vendors to createa an event later
    //createProfile: async (profile: {
    //   first_name: string;
    //    last_name: string;
    //    email: string;
    //}): Promise<void> => {
    //    await axios.post(`${API_BASE_URL}/profile`, profile);
    //},


    // Will allow vendors to delete an event later
    //deleteProfile: async (id: string): Promise<void> => {
    //    await axios.delete(`${API_BASE_URL}/event/${id}`);
    //},

    // WIll allow vendors to update an event later
    //updateProfile: async (
    //    id: string,
    //    profile: {
    //        first_name: string;
    //        last_name: string;
    //        email: string;
    //    }
    //): Promise<Event> => {
    //    const { data } = await axios.put(`${API_BASE_URL}/profile/${id}`, profile);
    //    return data;
    //},
};