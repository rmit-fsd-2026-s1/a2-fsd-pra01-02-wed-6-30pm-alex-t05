import { Box, Button } from "@chakra-ui/react";
import { useEvent } from '../context/EventContext';
import { useEffect, useState } from "react";
import { MdSettings } from 'react-icons/md'
import EventFormModal from "@/components/EventFormModal";
import { useRouter } from "next/router";
import { Event } from "@/types/types";
import { AdminService } from "@/services/api";

interface CardProps {
    event: Event;
    vendorUserNames?: string[];
}

export default function Card({ event, vendorUserNames }: CardProps) {
    const { events, fetchFeaturedEvents, fetchEvents } = useEvent();
    const [expanded, setExpanded] = useState<"createApplication" | "viewApplications" | "blockDates" | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [eventForm, setEventForm] = useState<{ mode: "editEvent" | "createEvent", event: Event } | null>(null);
    const [error, setError] = useState<string | null>(null);


    const router = useRouter();

    const handleEventSubmit = async (updatedEventData: any) => {
        console.log("Received event data from form submission:", updatedEventData);
        const updatedEvent: Event = {
            eventId: event.eventId,
            eventName: updatedEventData.eventName,
            numberOfGuest: updatedEventData.numberOfGuest,
            shortDescription: updatedEventData.shortDescription,
            image: updatedEventData.image,
            address: updatedEventData.address,
        };
        try {
            await AdminService.updateEvent(updatedEvent.eventId, {
                eventName: updatedEvent.eventName,
                numberOfGuest: updatedEvent.numberOfGuest,
                address: updatedEvent.address,
                shortDescription: updatedEvent.shortDescription,
                image: updatedEvent.image,
            });
            setEventForm(null);
            fetchFeaturedEvents(); // Refresh the featured events list after updating
        } catch (error) {
            console.error("Error updating event:", error);
            setError("Failed to update event. Please try again.");
        }
    }

    const handleAddToFeatured = async (eventId: string) => {
        try {
            await AdminService.addFeaturedEvent(eventId);
            fetchFeaturedEvents(); // Refresh the featured events list after adding
        } catch (error) {
            console.error("Error adding event to featured:", error);
            setError("Failed to add event to featured. Please try again.");
        }
    };
    if (events.length === 0 || !events) {
        return <h1>No events available.</h1>;
    } else
        return (
            <Box>
                <img src={event.image} alt={event.eventName} className="w-full h-24 object-cover mb-4" />
                <h2 className="!text-2xl font-semibold mb-2">{event.eventName}</h2>
                <div className="grid grid-cols-2">
                    <p className="text-gray-600">Occupancy: {event.numberOfGuest}</p>
                    <p className="text-gray-600">Address: {event.address || "No address provided"}</p>
                </div>
                <p className="text-gray-600 mt-2">Description: {event.shortDescription}</p>
                {error && <p className="text-red-500">{error}</p>}
                <Box
                    mt={4}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    h="100%"
                >
                    <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                        {/* re use this for featured events
                            <Button
                                colorScheme='teal'
                                type='button'
                                onClick={() => addPreferredEvents(event.eventId)}
                            >Save Preferrences
                            </Button>
                            */}
                    </Box>
                </Box>
                <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                    {/*Event control menu: edit, block dates, delete*/}
                    <Box position="relative">
                        <Button
                            colorScheme='teal'
                            type='button'
                            onClick={() => handleAddToFeatured(event.eventId)}
                        >Add to Featured
                        </Button>
                        <Button
                            colorScheme='teal'
                            type='button'
                            className="float-right w-20 items-center"
                            onClick={() => setMenuOpen(!menuOpen)}
                        ><MdSettings />
                        </Button>
                        {menuOpen && (
                            <Box
                                position="absolute"
                                top="40px"
                                right={0}
                                borderWidth="1px"
                                borderRadius="md"
                                bg="white"
                                shadow="md"
                            >
                                <Button
                                    variant="ghost"
                                    colorScheme="blue"
                                    onClick={() => {
                                        setEventForm({ mode: "editEvent", event: event });
                                        setMenuOpen(false)
                                        fetchEvents();

                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={async () => {
                                        if (confirm("Are you sure you want to delete this event?")) {
                                            await AdminService.deleteEvent(event.eventId);
                                            fetchEvents(); // Refresh the event list after deletion
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                                {/*}
                                <Button
                                    colorScheme="yellow"
                                    variant="ghost"
                                    onClick={() => setEventForm({ mode: "attachToVendor", event: event })}
                                >
                                    Attach
                                </Button>
                                {*/}
                            </Box>

                        )}
                    </Box>
                </Box>
                {/*Event edit/create Form*/}
                {eventForm && (
                    <EventFormModal
                        mode={eventForm.mode}
                        selectedEvent={event}
                        onClose={() => setEventForm(null)}
                        onSubmit={handleEventSubmit}
                    />
                )}
            </Box>);
}
