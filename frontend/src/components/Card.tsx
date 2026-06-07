import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useEvent } from '../context/EventContext';
import { useEffect, useState } from "react";
import ApplicantList from "./vendor/ApplicantList";
import ApplicationForm from "./ApplicationForm";
import { Application } from "@/types/application";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Event } from "@/types/event";
import { userService } from "@/services/api";
import { MdArrowDropDown, MdSettings } from 'react-icons/md'
import EventFormModal from "./vendor/modals/EventFormModal";
import { useRouter } from "next/router";
import { eventService, applicationService } from "@/services/api";

interface CardProps {
    event: Event;
}

export default function Card({ event }: CardProps) {
    const { events, fetchPreferredForHirer, fetchEventsForVendor } = useEvent();
    const { user } = useAuth();
    const [expanded, setExpanded] = useState<"createApplication" | "viewApplications" | "blockDates" | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [eventForm, setEventForm] = useState<{ mode: "editEvent" | "createEvent", event: Event } | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();
    const handleApplicationSubmit = (application: Application) => {
        console.log("Submitting application:", application);
        applicationService.submitApplication(application);
        setExpanded(null); // Collapse the application form after submission
    };

    const handleEventSubmit = async (updatedEventData: any) => {
        //TODO implement event update logic, which will likely involve calling an API endpoint to update the event in the backend, then updating the event in the frontend state to reflect the changes
        const { tags, ...eventDataWithoutTags } = updatedEventData;
        const updatedEvent: Event = {
            ...eventDataWithoutTags,
            numberOfGuest: parseInt(eventDataWithoutTags.numberOfGuest),
            user: user!.userName
        };
        await eventService.updateEvent(event.eventId, updatedEvent);
        await eventService.setTagsForEvent(event.eventId, tags);
        setEventForm(null); // Close the event form modal after submission
        fetchEventsForVendor(); // Fetchs all vendor events again to update the list
    }

    const addPreferredEvents = async (eventID: number) => {
        try {
            await userService.createPreferredEventForUser(user!.userName, eventID);
            fetchPreferredForHirer(); // Refresh the preferred events list after adding a new preferred event
        } catch (error) {
            console.error("Error adding preferred event:", error);
            setError("Failed to add preferred event. Please try again.");
        }
    }

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
                {/*Hirer interface*/}
                {user && (user.role === "hirer" ? (
                    <Box
                        mt={4}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        h="100%"
                    >
                        {expanded === "createApplication" && (
                            console.log(`Rendering ApplicationForm for event ID: ${event.eventId}`),
                            <Box mt={4} pl={4}>
                                <ApplicationForm
                                    event={event} // Passes the entire event object to the form
                                    onSubmit={handleApplicationSubmit}
                                    onClose={() => setExpanded(null)}
                                />
                            </Box>
                        )}
                        <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                            <Button
                                colorScheme='teal'
                                type='button'
                                onClick={() => {
                                    setExpanded(!expanded ? "createApplication" : null);
                                }}
                            >{expanded ? "Hide" : "Apply"}
                            </Button>

                            <Button
                                colorScheme='teal'
                                type='button'
                                onClick={() => addPreferredEvents(event.eventId)}
                            >Save Preferrences
                            </Button>
                        </Box>
                    </Box>
                ) : user.role === "vendor" ? (
                    <>
                        {/*Vendor interface*/}
                        <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                            <Button
                                colorScheme='teal'
                                type='button'
                                className="w-50 items-center"
                                onClick={() => {
                                    setExpanded(expanded !== "viewApplications" ? "viewApplications" : null);
                                    console.log(`Selected Event ID: ${event.eventId}`);
                                }}
                            >View Applications
                            </Button>
                            {/*Event control menu: edit, block dates, delete*/}
                            <Box position="relative">
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
                                                fetchEventsForVendor(); 
                                                
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            colorScheme="yellow"
                                            onClick={() => setExpanded(expanded !== "blockDates" ? "blockDates" : null)}
                                        >
                                            Block Dates
                                        </Button>
                                        <Button
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to delete this event?")) {
                                                    await eventService.deleteEvent(event);
                                                    fetchEventsForVendor(); // Refresh the event list after deletion
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Box>

                                )}
                            </Box>
                        </Box>
                        {/*Applications list*/}
                        {expanded === "viewApplications" && (
                            <Box mt={4} pl={4}>
                                <ApplicantList event={event} />
                            </Box>
                        )}
                        {/*Blocking Dates*/}
                        {expanded === "blockDates" && (
                            <Box mt={4} pl={4}>
                                <ApplicationForm
                                    event={event}
                                    onSubmit={handleApplicationSubmit}
                                    onClose={() => setExpanded(null)}
                                />
                            </Box>
                        )}
                        {/*Event edit/create Form*/}
                        {eventForm && (
                            <EventFormModal
                                mode={eventForm.mode}
                                selectedEvent={event}
                                onClose={() => setEventForm(null)}
                                onSubmit={handleEventSubmit}
                            />
                        )}
                    </>
                ) : null
                )}
            </Box>);
}
