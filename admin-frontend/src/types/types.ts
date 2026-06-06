export interface Admin {
    userName: string;
    password: string;
}

export interface Event {
    eventId: string;
    eventName: string;
    numberOfGuest: number;
    address: string;
    shortDescription?: string;
    image: string;
}

export interface User {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    events?: Event[];
}

export interface FeatureEvent {
    FeaturedId: string;
    event: Event;
}