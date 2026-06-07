export type featuredEvent = {
    FeaturedId: number;
    event: {
        eventId: number;
        eventName: string;
        numberOfGuest: number;
        address?: string; // Optional field for event address
        shortDescription?: string;
        image?: string; // Optional field for event image URL
        isBlocked: boolean; // Optional field for vendors to block the events. FOR CREDIT.
        user?: string;
    };
};