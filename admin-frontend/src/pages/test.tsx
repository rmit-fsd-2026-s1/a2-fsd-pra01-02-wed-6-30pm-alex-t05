import { useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { AdminService } from '../services/api';
import { useEvent } from "@/context/EventContext";
export default function Test() {
    const { fetchEvents, events } = useEvent();
    const router = useRouter();
    const [eventId, setEventId] = useState<number>(0);


    return (
        <div>
            {events.map((event) => (
                <div key={event.eventId}>
                    <h2>{event.eventName}</h2>
                    <p>{event.shortDescription}</p>
                    <Button onClick={() => router.push(`/events/${event.eventId}`)}>View Details</Button>
                </div>
            ))}
        </div>
    );
}
