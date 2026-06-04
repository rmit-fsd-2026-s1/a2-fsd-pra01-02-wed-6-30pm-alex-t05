export type Application = {
    applicationId: number;
    eventId: number,
    applicantUserName: string,
    status: "pending" | "approved" | "rejected"
    rating: number | null;
    startDate: string;
    endDate: string;
    guests: number;
};