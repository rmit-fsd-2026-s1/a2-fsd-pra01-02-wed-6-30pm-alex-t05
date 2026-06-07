import { Application } from "./application";

export type Event = {
    eventId: number;
    eventName: string;
    numberOfGuest: number;
    shortDescription?: string;
    user: string; // The unique username of the hirer who created the event
    image?: string; // Optional field for event image URL
    address?: string; // Optional field for event address
    //applications: Application[]; // Stores the details of each application, including comments, status, rating, and hire date.
    isBlocked: boolean; // Optional field for vendors to block the events. FOR CREDIT.
};