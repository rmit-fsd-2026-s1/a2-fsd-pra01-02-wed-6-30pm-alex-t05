import VisualRepresentation from "@/components/vendor/VisualRepresentation";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from '../../context/EventContext';
import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { eventService } from "@/services/api";

export default function Vendor() {
    const { user } = useAuth()
    const { events } = useEvent();
    const [visualisationsVisible, setVisualisationsVisible] = useState(false);
    const [ownedEvents, setOwnedEvents] = useState<Event[] | null>(null);

    useEffect (() => {
        //Fetchest owned events for the vendor
        const fetchOwnedEvents = async () => {
            if (user) {
                const eventsByUser = await eventService.getEventsByUser(user.userName);
                setOwnedEvents(eventsByUser);
            }
        };
        fetchOwnedEvents();
    }, [user, events]);

    return (
        user && user.role === "vendor" ? (
            <div className="min-h-screen items-center justify-center bg-gray-100">
                <Box>
                    <Button colorScheme='teal' type='button'
                        onClick={() => {
                            setVisualisationsVisible(!visualisationsVisible);
                        }}>
                        {visualisationsVisible ? "Hide Visualisations" : "Show Visualisations"}
                    </Button>
                    {visualisationsVisible &&
                        <VisualRepresentation />}
                </Box>
                <h1 className="!text-2xl flex items-center justify-center">Venue List</h1>
                <div className="grid grid-cols-2 gap-4">
                    {ownedEvents?.map((event) => (
                        <div className="bg-white p-6 ml-3 mr-3 mt-3 rounded-lg shadow-md" key={event.eventId}>
                            <Card
                                eventID={event.eventId}
                                eventName={event.eventName}
                                numberOfGuest={event.numberOfGuest}
                                date={event.date}
                                time={event.time}
                                duration={event.duration}
                                shortDescription={event.shortDescription}
                                image={event.image}
                                isBlocked={event.isBlocked}
                            />
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-gray-700">You must be signed in as a vendor to view this page.</p>
                </div>
            </div>
        )
    )
}