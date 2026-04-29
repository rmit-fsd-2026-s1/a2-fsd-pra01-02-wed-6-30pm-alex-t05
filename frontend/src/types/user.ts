import { preferredEvent } from "./preferredEvents";

export type User = {
    userName: string; // Unique identifier for the user
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string; // e.g., "hirer", "vendor"
    phoneNumber?: string; // Optional phone number field
    eventRankings?: number[]
    preferredEvents?: preferredEvent[]
    vendorComments?: [vendorUserName: string, comment: string][]
    complianceDocuments?: {
        fileName: string;
        fileType: string;
        data: string; //base64 encoded file data
    }[]
};


export const DEFAULT_USERS: User[] = [
    // Hirers
    {
        userName: "willk",
        firstName: "William",
        lastName: "Knight",
        email: "william.knight@team11.com",
        password: "Rmit1234!",
        role: "hirer",
        preferredEvents: []

    },
    {
        userName: "johnd",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        password: "Password123!",
        role: "hirer",
        preferredEvents: []
    },
    {
        userName: "harryp",
        firstName: "Harry",
        lastName: "Potter",
        email: "harry.potter@email.com",
        password: "Magic123!",
        role: "hirer",
        preferredEvents: []
    },

    // Vendors
    {
        userName: "minhn",
        firstName: "Minh",
        lastName: "Nguyen",
        email: "minh.nguyen@team11.com",
        password: "Rmit1234@",
        role: "vendor"
    },
    {
        userName: "janed",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@email.com",
        password: "Password123@",
        role: "vendor"
    },
    {
        userName: "homers",
        firstName: "Homer",
        lastName: "Simpson",
        email: "homer.simpson@email.com",
        password: "Donut123!",
        role: "vendor"
    }
];
