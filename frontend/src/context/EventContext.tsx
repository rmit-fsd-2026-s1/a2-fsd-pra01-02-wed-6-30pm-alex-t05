import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { Event } from '../types/event';
import { eventService, userService } from '@/services/api';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';
import { preferredEvent } from '@/types/preferredEvents';

type EventContextType = {
    events: Event[];
    eventsForVendor: Event[];
    eventsForHirer: preferredEvent[];
    setEvents: (events: Event[]) => void;
    fetchEvents: () => void;
    fetchEventsForVendor: () => void;
    fetchPreferredForHirer: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [eventsForVendor, setEventsForVendor] = useState<Event[]>([]);
    const [eventsForHirer, setEventsForHirer] = useState<preferredEvent[]>([]);
    const { user } = useAuth();

    //const [selectedEventID, setSelectedEventID] = useState<number | null>(null);

    //initialises events
    useEffect(() => {
        fetchEvents();
        if (user?.userName) {
            fetchEventsForVendor();
            fetchPreferredForHirer();
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
        if (user?.role === "vendor") {
            try {
                const data = await userService.getAllEventsForVendor(user?.userName as string);
                setEventsForVendor(data);
            } catch (error) {
                console.error("Error fetching events for vendor:", error);
            }
        }
    };

    const fetchPreferredForHirer = async () => {
        if (user?.role === "hirer") {
            try {
                const data = await userService.getAllPreferredEventsForUser(user?.userName as string);
                setEventsForHirer(data);
            } catch (error) {
                console.error("Error fetching preferred events for hirer:", error);
            }
        }
    };

    return (
        <EventContext.Provider value={{ events, setEvents, eventsForVendor, eventsForHirer, fetchEvents, fetchEventsForVendor, fetchPreferredForHirer }}>
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