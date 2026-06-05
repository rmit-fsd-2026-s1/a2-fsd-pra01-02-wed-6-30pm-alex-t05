import axios from "axios";
import { Event } from "../types/event";
import { User } from "../types/user";
import { Application } from "@/types/application";
import { preferredEvent } from "@/types/preferredEvents";

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

    updateEvent: async (eventId: number, event: Event): Promise<Event> => {
        const { data } = await axios.put(`${API_BASE_URL}/events/${eventId}`, event);
        return data;
    },

    deleteEvent: async (event: Event): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/events/${event.eventId}`);
    },
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

    getUserCommentsFromVendor: async (vendorUserName: string, hirerUserName: string): Promise<string> => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/users/${vendorUserName}/comments/${hirerUserName}`);
            console.log("Fetched comments:", data);
            return data.comment;
        } catch (error) {
            //Reference: AI suggestion
            //This was breaking if no comment was found i.e. the vendor had not created a comment before
            //this if statement allows it to continue and return an empty string if a 404 is returned
            if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
                console.warn(`No comment found from vendor ${vendorUserName} for user ${hirerUserName}`);
                return "";
            }
            console.error("Error fetching user comments from vendor:", error);
            return "";
        }
    },

    setUserCommentFromVendor: async (vendorUserName: string, hirerUserName: string, comment: string): Promise<void> => {
        try {
            await axios.post(`${API_BASE_URL}/users/${vendorUserName}/comments/${hirerUserName}`, { comment });
        } catch (error) {
            console.error("Error setting user comment from vendor:", error);
        }
    },
    updateUser: async (updatedUser: User) => {
        //sends put request with updated user
        try {
            await axios.put(`${API_BASE_URL}/users/${updatedUser.userName}`, updatedUser)
            return true;
        } catch (error) {
            console.error("Error updating user:", error);
            return false;
        }
    },

    authenticateUser: async (email: string, password: string) => {
        const existingData = await userService.getAllUsers();
        const user = existingData.find((user: User) => user.email === email && user.password === password);
        return user || null;
    },


    deleteUserCommentFromVendor: async (vendorUserName: string, hirerUserName: string): Promise<void> => {
        try {
            await axios.delete(`${API_BASE_URL}/users/${vendorUserName}/comments/${hirerUserName}`);
        } catch (error) {
            console.error("Error deleting user comment from vendor:", error);
        }
    },

    getAllPreferredVenuesForUser: async (userName: string): Promise<preferredEvent[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/hirer/${userName}/preferred-events`);
        return data;
    },

    createPreferredEventForUser: async (userName: string, eventId: number): Promise<void> => {
        await axios.post(`${API_BASE_URL}/hirer/${userName}/preferred-events/${eventId}`);
    },

    deletePreferredEventForUser: async (userName: string, eventId: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/hirer/${userName}/preferred-events/${eventId}`);
    },
};

export const applicationService = {
    //get
    getApplicationsForUser: async (userName: string): Promise<Application[] | []> => {
        //fetches all applications for a user from the backend
        try {
            if (!userName) return [];
            const { data } = await axios.get(`${API_BASE_URL}/users/${userName}/applications`);
            return data;
        } catch (error) {
            console.error("Error fetching applications:", error);
            return [];
        }
    },
    getUnavailableDatesForEvent: async (eventId: number): Promise<{ startDate: string; endDate: string }[]> => {
        const { data } = await axios.get(`${API_BASE_URL}/events/${eventId}/unavailable-dates`);
        return data;
    },
    getRatingForUser: async (applicantUserName: string): Promise<number | null> => {
        //filters applications based on username, and averages the ratings
        try {
            if (!applicantUserName) return 0;
            console.log("Fetching rating for user:", applicantUserName);
            const { data } = await axios.get(`${API_BASE_URL}/users/${applicantUserName}/rating`);
            console.log("Received rating data:", data);
            return data;
        } catch (error) {
            console.error("Error fetching user rating:", error);
            return 0;
        }
    },
    getApplicationsForEvent: async (eventId: number): Promise<Application[] | []> => {
        //fetches all applications for an event from the backend
        try {
            const { data } = await axios.get(`${API_BASE_URL}/events/${eventId}/applications`);
            return data;
        } catch (error) {
            console.error("Error fetching applications for event:", error);
            return [];
        }
    },

    //post
    submitApplication: async (application: Application): Promise<boolean> => {
        try {
            await axios.post(`${API_BASE_URL}/applications`, application);
            return true;
        } catch (error) {
            console.error("Error submitting application:", error);
            return false;
        }
    },
    updateApplication: async (updatedApplication: Application) => {
        //sends put request with updated application
        try {
            await axios.put(`${API_BASE_URL}/applications/${updatedApplication.applicationId}`, updatedApplication)
            //auto decline overlapping applications if the application was approved
            if (updatedApplication.status === "approved") {
                try {
                    await axios.put(`${API_BASE_URL}/events/${updatedApplication.eventId}/auto-decline`, updatedApplication);
                    return true;
                } catch (error) {
                    console.error("Error auto-declining overlapping applications:", error);
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.error("Error updating application:", error);
            return false;
        }

    },


}