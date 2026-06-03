import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { Event } from '../types/event';
import { eventService, userService } from '@/services/api';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';

type EventContextType = {
    //event: Event | null;
    //setEvent: (event: Event | null) => void;

    events: Event[];
    eventsForVendor: Event[];
    setEvents: (events: Event[]) => void;

    //selectedEventID?: number | null;
    //setSelectedEventID: (id: number | null) => void;
    //updateEvent: (updatedEvent: Event) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [eventsForVendor, setEventsForVendor] = useState<Event[]>([]);
    const { user } = useAuth();

    //const [selectedEventID, setSelectedEventID] = useState<number | null>(null);

    //initialises events
    useEffect(() => {
        fetchEvents();
        if (user?.userName) {
            fetchEventsForVendor();
        }
    }, [user?.userName]);

    const fetchEvents = async () => {
        try {
            const data = await eventService.getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const fetchEventsForVendor = async () => {
        if (!user?.role || user.role === "vendor") {
            try {
                const data = await userService.getAllEventsForVendor(user?.userName as string);
                setEventsForVendor(data);
            } catch (error) {
                console.error("Error fetching events for vendor:", error);
            }
        }
    };

    return (
        <EventContext.Provider value={{ events, setEvents, eventsForVendor }}>
            {children}
        </EventContext.Provider>
    );
}

export const useEvent = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvent must be used within an EventProvider');
    }
    return context;
};