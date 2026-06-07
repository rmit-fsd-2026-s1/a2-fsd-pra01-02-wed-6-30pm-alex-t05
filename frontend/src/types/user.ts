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
    createdAt?: Date;
};