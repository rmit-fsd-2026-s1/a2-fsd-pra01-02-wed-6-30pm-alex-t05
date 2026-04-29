export type preferredEvent = {
    eventID: number;
    eventName: string;
    numberOfGuest: number;
    date: string;
    time: string;
    duration: number;
    shortDescription?: string;
    owner: string; // The unique username of the hirer who created the event
    image?: string; // Optional field for event image URL
    isBlocked: boolean; // Optional field for vendors to block the events. FOR CREDIT.
};