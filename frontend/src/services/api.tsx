import axios from "axios";
import { Event } from "../types/event";
import { User } from "../types/user";

const API_BASE_URL = "http://localhost:3001/api";

// Will need to add validations in the future.

export const eventService = {
    getAllEvents: async (): Promise<Event[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/events`);
        return data;
    },

    getEvent: async (id: string): Promise<Event> => {
        const { data } = await axios.get(`${API_BASE_URL}/events/${id}`);
        return data;
    },

    getEventsByUser: async (userName: string): Promise<Event[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/users/${userName}/events`);
        return data;
    },

    createEvent: async (event: Event): Promise<void> => {
        await axios.post(`${API_BASE_URL}/events`, event);
    },

    updateEvent: async (id: string, event: Event): Promise<Event> => {
        const { data } = await axios.put(`${API_BASE_URL}/events/${id}`, event);
        return data;
    },

    deleteEvent: async (event: Event): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/events/${event.eventId}`);
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

export const userService = {
    getAllUsers: async (): Promise<User[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/users`);
        return data;
    },

    getOneUser: async (userName: string): Promise<User> => {
        const { data } = await axios.get(`${API_BASE_URL}/users/${userName}`);
        return data;
    },

    getEvent: async (id: string): Promise<Event> => {
        const { data } = await axios.get(`${API_BASE_URL}/users/${id}`);
        return data;
    },

    createUser: async (user: {
        userName: string,
        firstName: string,
        lastName: string,
        email: string
        password: string,
        role: string,
    }): Promise<void> => {
        await axios.post(`${API_BASE_URL}/users`, user);
    },

    // Vendor CRUD
    getAllEventsForVendor: async (userName: string): Promise<Event[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/vendor/${userName}/events`);
        return data;
    },

    getOneEventForVendor: async (userName: string, eventId: string): Promise<Event> => {
        const { data } = await axios.get(`${API_BASE_URL}/vendor/${userName}/events/${eventId}`);
        return data;
    },

    // event update
    createEventforVendor: async (userName: string, event: {
        eventName: string,
        eventType: string,
        address: string,
        description: string,
    }): Promise<void> => {
        await axios.post(`${API_BASE_URL}/vendor/${userName}/events`, event);
    },

    getAllPreferredEventsForHirer: async (userName: string): Promise<Event[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/users/${userName}/preferredevents`);
        return data;
    },

    addPreferredEvent: async (eventId: number, userName: string): Promise<void> => {
        const { data } = await axios.post(`${API_BASE_URL}/users/${userName}/preferredevents/${eventId}`);
        return data;
    },


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