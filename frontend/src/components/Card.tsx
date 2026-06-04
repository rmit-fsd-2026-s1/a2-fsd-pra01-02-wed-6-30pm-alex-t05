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
    eventId: number;
    eventName: string;
    numberOfGuest: number;
    address?: string;
    image?: string; // Optional field for event image URL
    isBlocked: boolean;
    shortDescription?: string;
}

export default function Card({ eventId, eventName, numberOfGuest, address, image, isBlocked, shortDescription }: CardProps) {
    const { events } = useEvent();
    const { user } = useAuth();
    const loggedinUser = useCurrentUser();
    const [expanded, setExpanded] = useState<"createApplication" | "viewApplications" | "blockDates" | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [eventForm, setEventForm] = useState<{mode: "editEvent", event: Event} | null>(null);
    const [error, setError] = useState<string | null>(null);
    const selectedEvent = events.find((event) => event.eventId === eventId)!;
    const router = useRouter();
    const handleApplicationSubmit = (application: Application) => {
        console.log("Submitting application:", application);
        applicationService.submitApplication(application);
        setExpanded(null); // Collapse the application form after submission
        };

    const handleEventSubmit = async (updatedEventData: any) => {
        //TODO implement event update logic, which will likely involve calling an API endpoint to update the event in the backend, then updating the event in the frontend state to reflect the changes
        console.log("Updated event data:", updatedEventData);
        await eventService.updateEvent(selectedEvent.eventId, updatedEventData);
        setEventForm(null); // Close the event form modal after submission
        router.reload(); // Refresh the page to show updated event details, ideally this should be replaced with a more efficient state update
    }

    const addPreferredEvents = async (eventID: number) => {
        try {
            await userService.addPreferredEvent(eventID, loggedinUser!.userName);
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
                <img src={image} alt={eventName} className="w-full h-24 object-cover mb-4" />
                <h2 className="!text-2xl font-semibold mb-2">{eventName}</h2>
                <div className="grid grid-cols-2">
                    <p className="text-gray-600">Occupancy: {numberOfGuest}</p>
                    <p className="text-gray-600">Address: {address || "No address provided"}</p>
                </div>
                <p className="text-gray-600 mt-2">Description: {shortDescription}</p>
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
                            console.log(`Rendering ApplicationForm for event ID: ${selectedEvent.eventId}`),
                            <Box mt={4} pl={4}>
                                <ApplicationForm
                                    event={selectedEvent} // Passes the entire event object to the form
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
                                isDisabled={isBlocked}
                            >{expanded ? "Hide" : "Apply"}
                            </Button>

                            <Button
                                colorScheme='teal'
                                type='button'
                                onClick={() => addPreferredEvents(eventId)}
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
                                    console.log(`Selected Event ID: ${eventId}`);
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
                                        onClick={() => {setEventForm({mode: "editEvent", event: selectedEvent}); setMenuOpen(false)}
                                            }
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
                                        onClick={ async () => {
                                            if (confirm("Are you sure you want to delete this event?")) {
                                                await eventService.deleteEvent(selectedEvent);
                                                router.reload();
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
                                <ApplicantList event={selectedEvent} />
                            </Box>
                        )}
                        {/*Blocking Dates*/}
                        {expanded === "blockDates" && (
                            <Box mt={4} pl={4}>
                                <ApplicationForm
                                    event={selectedEvent}
                                    onSubmit={handleApplicationSubmit}
                                    onClose={() => setExpanded(null)}
                                />
                            </Box>
                        )}
                        {/*Event edit/create Form*/}
                        {eventForm && (
                            <EventFormModal
                                mode={eventForm.mode}
                                selectedEvent={selectedEvent}
                                onClose={() => setEventForm(null)}
                                onSubmit={handleEventSubmit}
                            />
                        )}
                    </>
                ) : null
                )}
            </Box>);
}
