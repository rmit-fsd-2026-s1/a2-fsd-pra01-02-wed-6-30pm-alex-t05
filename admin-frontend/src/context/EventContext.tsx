import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { Event } from '../types/types';
import { AdminService } from "@/services/api";

type EventContextType = {
    events: Event[];
    fetchEvents: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [events, setEvents] = useState<Event[]>([]);
    //retrieves current user to persist login
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await AdminService.getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    return (
        <EventContext.Provider value={{ events, fetchEvents }}>
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
