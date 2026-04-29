import { Event } from "../types/event";
import { Application } from "@/types/application";

//TODO: this file is getting a bit bloated and hard to follow

export function getApplicationsForUser(userName: string, events: Event[]) : Application[] | [] {
    const applications: Application[] = [];
    //loops through events and filters by userName and appends results to applications array
    for (const event of events) {
        const userApplications = event.applications.filter(app => app.applicantUserName === userName);
        applications.push(...userApplications);
    }
    return applications;
}

export function getRatingForUser(userName: string, events: Event[]) : number | null {
    const applicationsWithRatings = 
    getApplicationsForUser(userName, events)
    .filter(application => application.rating !== null);
    
    if (applicationsWithRatings.length === 0) {
        return null; //no applications
    }

    let sumOfRatings = 0;
    for (const application of applicationsWithRatings) {
        sumOfRatings += application.rating!;
    }
    const averageRating = sumOfRatings / applicationsWithRatings.length;    
    
    return averageRating;
}

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
        comment: "",
        status: "pending",
        rating: null,
        startDate: normaliseDate(startDate),
        endDate: normaliseDate(endDate)
    };
}

export function normaliseDate(dateStr: string) : string {
    //formats dates as YYYY-MM-DD
    return dateStr.split("T")[0];
}


//setters
export function setApplicationStatus(application: Application, newStatus: "pending" | "approved" | "rejected") : Application {
    return {...application, status: newStatus};
}

export function setCommentToApplication(application: Application, comment: string) : Application {
    return {...application, comment};
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