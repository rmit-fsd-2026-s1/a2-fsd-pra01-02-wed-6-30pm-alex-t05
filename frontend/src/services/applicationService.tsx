import { Application } from "@/types/application";

//constructor
export function createApplication(
    eventId: number, 
    applicantUserName: string, 
    startDate: string, 
    endDate: string,
    status: "pending" | "approved" | "rejected",
    guests: number,
    rating?: number
    ) : Application {
    return {
        applicationId: null!, // Will be set by the backend
        eventId,
        applicantUserName,
        status,
        rating: rating ?? null,
        startDate: normaliseDate(startDate),
        endDate: normaliseDate(endDate),
        guests,
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
