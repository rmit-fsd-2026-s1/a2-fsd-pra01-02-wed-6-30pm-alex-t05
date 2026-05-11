import { Event } from "../types/event";
import { Application } from "@/types/application";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

//TODO: this file is getting a bit bloated and hard to follow

export const getApplicationsForUser = async (userName: string) : Promise<Application[] | []> => {
    //fetches all applications for a user from the backend
    try {
        if (!userName) return [];
        const { data } = await axios.get(`${API_BASE_URL}/users/${userName}/applications`);
        return data;
    } catch (error) {
        console.error("Error fetching applications:", error);
        return [];
    }
}

export const getRatingForUser = async (userName: string) : Promise<number> => {
    //filters all applications for user with ratings
    try {
        const applications = await getApplicationsForUser(userName);
        const applicationsWithRatings = applications.filter(app => app.rating !== null);
        if (applicationsWithRatings.length === 0) {
            return 0; // No ratings available
        }
        //sum
        let sumOfRatings = 0;
        for (const application of applications) {
            if (application.rating) {
                sumOfRatings += application.rating;
            }
        }
        //average
        const averageRating = sumOfRatings / applicationsWithRatings.length;  
        return averageRating; 
    } catch (error) {
        console.error("Error fetching applications:", error);
        return 0;
    }
}

//constructor
export function createApplication(
    eventID: number, 
    applicantUserName: string, 
    startDate: string, 
    endDate: string
    ) : Application {
    return {
        //unique ID for applications
        id: crypto.randomUUID(), 
        eventID,
        applicantUserName,
        status: "pending",
        rating: null,
        startDate: normaliseDate(startDate),
        endDate: normaliseDate(endDate)
    };
}

//called on all calender inputs to streamline date handling
export function normaliseDate(dateStr: string) : string {
    //formats dates as YYYY-MM-DD
    return dateStr.split("T")[0];
}


//setters
export function setApplicationStatus(application: Application, newStatus: "pending" | "approved" | "rejected") : Application {
    return {...application, status: newStatus};
}

export function setApplicationRating(application: Application, rating: number) : Application {
    return {...application, rating};
}

//returns date ranges of event that are occupied
export function getBlockedDatesForEvent(event: Event) : {startDate: string, endDate: string}[] {
    return event.applications
        .filter(app => app.status === "approved")
        .map(app => ({ 
            startDate: app.startDate, 
            endDate: app.endDate 
        }));
}

//boolean value to check if application overlaps any already booked dates
export function hasConflict(application: Application, event: Event) : boolean {
    const blockedDates = getBlockedDatesForEvent(event);
    for (const blocked of blockedDates) {
        if ((
            application.startDate < blocked.endDate 
            && application.endDate > blocked.startDate)
            ) {
            return true;
        }
    }
    return false;
}

//validator and error constructor for applications
export function validateApplication(application: Application, event: Event   
) : ["startDate" | "endDate", string] | null {
    const today = normaliseDate(new Date().toISOString());
    //checks start date is before end date
    if (application.startDate > application.endDate) {
        return ["startDate", "Start date cannot be after end date."];
    }
    //checks start date is not in the past
    if (application.startDate < today) {
        return ["startDate", "Start date cannot be in the past."];
    }
    //compares application dates with blocked dates to check for conflicts
    if (hasConflict(application, event)) {
        return ["endDate", "Selected dates conflict with existing approved applications."];
    }
    return null;
}

//if an application is approved, all overlapping applications are automatically rejected
export function autoDeclineOverlappingApplications(event: Event) {
    return event.applications.map(application => {
        if (application.status === "pending" && hasConflict(application, event)) {
            return setApplicationStatus(application, "rejected");
        }
        return application;
    });
}