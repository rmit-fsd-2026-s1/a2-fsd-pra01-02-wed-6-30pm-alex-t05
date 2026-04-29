import { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { Event, DEFAULT_EVENT as DEFAULT_EVENTS } from '../types/event';

type EventContextType = {
    event: Event | null;
    setEvent: (event: Event | null) => void;

    events: Event[];
    setEvents: (events: Event[]) => void;

    selectedEventID?: number | null;
    setSelectedEventID: (id: number | null) => void;
    updateEvent: (updatedEvent: Event) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEventID, setSelectedEventID] = useState<number | null>(null);

    const updateEvent = (updatedEvent: Event) => {
        setEvents(prevEvent => {
            return prevEvent.map(event => event.eventID === updatedEvent.eventID ? updatedEvent : event);
        });
    };

    //initialises events
    useEffect(() => {
        const storedEvents = localStorage.getItem('events');
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        } else {
            localStorage.setItem('events', JSON.stringify(DEFAULT_EVENTS));
            setEvents(DEFAULT_EVENTS);
        }
    }, []);

    //updates localstorage whenever events state changes
    useEffect(() => {
        localStorage.setItem('events', JSON.stringify(events));
    }, [events]);

    return (
        <EventContext.Provider value={{ event, setEvent, events, setEvents, selectedEventID, setSelectedEventID, updateEvent }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvent must be used within an EventProvider');
    }
    return context;
}