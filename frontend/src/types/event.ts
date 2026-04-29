import { Application } from "./application";

export type Event = {
    eventID: number;
    eventName: string;
    numberOfGuest: number;
    date: string;
    time: string;
    duration: number;
    shortDescription?: string;
    owner: string; // The unique username of the hirer who created the event
    image?: string; // Optional field for event image URL
    applications: Application[]; // Stores the details of each application, including comments, status, rating, and hire date.
    isBlocked: boolean; // Optional field for vendors to block the events. FOR CREDIT.
};

export const DEFAULT_EVENT: Event[] = [
    {
        eventID: 1,
        eventName: "Birthday Party",
        numberOfGuest: 30,
        date: '10/04/2026',
        time: "18:00",
        duration: 4,
        shortDescription: "Celebrate my birthday with friends and family!",
        owner: "minhn",
        image: "https://images.unsplash.com/photo-1562967005-a3c85514d3e9",
        applications: [],
        isBlocked: false
    },
    {
        eventID: 2,
        eventName: "Wedding Reception",
        numberOfGuest: 200,
        date: '15/04/2026',
        time: "17:00",
        duration: 6,
        shortDescription: "A beautiful celebration!",
        owner: "minhn",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
        applications: [],
        isBlocked: false
    },
    {
        eventID: 3,
        eventName: "Rock Concert",
        numberOfGuest: 300,
        date: '12/04/2026',
        time: "19:00",
        duration: 5,
        shortDescription: "Experience the best rock music live!",
        owner: "minhn",
        image: "https://images.unsplash.com/photo-1563837168-6eef1595aed9",
        applications: [],
        isBlocked: false
    },
    {
        eventID: 4,
        eventName: "Corporate Event",
        numberOfGuest: 150,
        date: '20/04/2026',
        time: "18:30",
        duration: 4,
        shortDescription: "A professional gathering for business networking.",
        owner: "janed",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865",
        applications: [
            {
                id: crypto.randomUUID(),
                eventID: 4,
                applicantUserName: "willk",
                status: "approved",
                rating: 5,
                startDate: "2026-04-11",
                endDate: "2026-04-15"
            },
            {
                id: crypto.randomUUID(),
                eventID: 4,
                applicantUserName: "harryp",
                status: "approved",
                rating: 3,
                startDate: "2026-04-12",
                endDate: "2026-04-16"
            },
            {
                id: crypto.randomUUID(),
                eventID: 4,
                applicantUserName: "willk",
                status: "pending",
                rating: null,
                startDate: "2026-04-20",
                endDate: "2026-04-25"
            },
            {
                id: crypto.randomUUID(),
                eventID: 4,
                applicantUserName: "harryp",
                status: "pending",
                rating: null,
                startDate: "2026-04-21",
                endDate: "2026-04-26"
            }
        ],
        isBlocked: false
    },
    {
        eventID: 5,
        eventName: "Marathon Charity Event",
        numberOfGuest: 100,
        date: '18/04/2026',
        time: "17:30",
        duration: 5,
        shortDescription: "Help us make a difference!",
        owner: "janed",
        image: "https://images.unsplash.com/photo-1596727362302-b8d891c42ab8",
        applications: [],
        isBlocked: false
    },
    {
        eventID: 6,
        eventName: "Art Exhibition",
        numberOfGuest: 80,
        date: '22/04/2026',
        time: "16:00",
        duration: 5,
        shortDescription: "Discover the world of contemporary art!",
        owner: "janed",
        image: "https://images.unsplash.com/photo-1566954979172-eaba308acdf0",
        applications: [],
        isBlocked: false
    },
    {
        eventID: 7,
        eventName: "Food Festival",
        numberOfGuest: 250,
        date: '25/04/2026',
        time: "12:00",
        duration: 8,
        shortDescription: "Help Us Celebrate Food and Culture!",
        owner: "homers",
        image: "https://images.unsplash.com/photo-1635702786344-f09eff66e7c4",
        applications: [],
        isBlocked: false
    },
    {
        eventID: 8,
        eventName: "Rave Event",
        numberOfGuest: 500,
        date: '28/04/2026',
        time: "09:00",
        duration: 8,
        shortDescription: "Help us, set up an unforgettable rave experience!",
        owner: "homers",
        image: "https://images.unsplash.com/photo-1506485854521-3e13d857db0b",
        applications: [],
        isBlocked: false
    },
    {
        eventID: 9,
        eventName: "Hackathon",
        numberOfGuest: 300,
        date: '30/04/2026',
        time: "18:00",
        duration: 6,
        shortDescription: "Watch out for people cheating",
        owner: "homers",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        applications: [],
        isBlocked: false
    }
];