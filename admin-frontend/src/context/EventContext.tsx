import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { Event, FeatureEvent } from '../types/types';
import { AdminService } from "@/services/api";

type EventContextType = {
    events: Event[];
    featuredEvents: FeatureEvent[];
    fetchEvents: () => void;
    fetchFeaturedEvents: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [featuredEvents, setFeaturedEvents] = useState<FeatureEvent[]>([]);
    //retrieves current user to persist login
    useEffect(() => {
        fetchEvents();
        fetchFeaturedEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await AdminService.getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const fetchFeaturedEvents = async () => {
        try {
            const data = await AdminService.getAllFeaturedEvents();
            setFeaturedEvents(data);
        } catch (error) {
            console.error("Error fetching featured events:", error);
        }
    };

    return (
        <EventContext.Provider value={{ events, featuredEvents, fetchEvents, fetchFeaturedEvents }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => {
    //provider
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvent must be used within an EventProvider');
    }
    return context;
};
