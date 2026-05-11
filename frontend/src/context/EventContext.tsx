import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { Event, DEFAULT_EVENT as DEFAULT_EVENTS } from '../types/event';
import { eventService } from '@/services/api';
import { useRouter } from 'next/router';

type EventContextType = {
    //event: Event | null;
    //setEvent: (event: Event | null) => void;

    events: Event[];
    eventsByUser: Event[];
    setEvents: (events: Event[]) => void;

    //selectedEventID?: number | null;
    //setSelectedEventID: (id: number | null) => void;
    //updateEvent: (updatedEvent: Event) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [eventsByUser, setEventsByUser] = useState<Event[]>([]);
    const { userName } = router.query;

    //const [selectedEventID, setSelectedEventID] = useState<number | null>(null);

    //initialises events
    useEffect(() => {
        fetchEvents();
        if (userName) {
            fetchEventsByUser();
        }
    }, [userName]);

    const fetchEvents = async () => {
        try {
            const data = await eventService.getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const fetchEventsByUser = async () => {
        try {
            const data = await eventService.getEventsByUser(userName as string);
            setEventsByUser(data);
        } catch (error) {
            console.error("Error fetching events by user:", error);
        }
    };

    return (
        <EventContext.Provider value={{ events, setEvents, eventsByUser }}>
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