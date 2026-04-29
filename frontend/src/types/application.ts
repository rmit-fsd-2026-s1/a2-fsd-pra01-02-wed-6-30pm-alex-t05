export type Application = {
    id: string;
    eventID: number,
    applicantUserName: string,
    status: "pending" | "approved" | "rejected"
    rating: number | null;
    startDate: string;
    endDate: string;
};