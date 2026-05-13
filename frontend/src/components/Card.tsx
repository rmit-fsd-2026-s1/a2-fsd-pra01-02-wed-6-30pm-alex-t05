import { Box, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useEvent } from '../context/EventContext';
import { useEffect, useState } from "react";
import ApplicantList from "./vendor/ApplicantList";
import ApplicationForm from "./ApplicationForm";
import { Application } from "@/types/application";
import { updateUser } from "@/services/userService";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Event } from "@/types/event";

interface CardProps {
    eventId: number;
    eventName: string;
    numberOfGuest: number;
    date: string;
    time: string;
    duration: number;
    image?: string; // Optional field for event image URL
    isBlocked: boolean;
    shortDescription?: string;
}

export default function Card({ eventId, eventName, numberOfGuest, date, time, duration, image, isBlocked, shortDescription }: CardProps) {
    const { events } = useEvent();
    const { user } = useAuth();
    const loggedinUser = useCurrentUser();
    const [expanded, setExpanded] = useState<"createApplication" | "viewApplications" | "blockDates" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const selectedEvent = events.find((event) => event.eventId === eventId)!;
    const handleSubmit = (eventId: number, application: Application) => { // Puts in the eventID value
        const foundEvent = events.find((u) => u.eventId === eventId);
        if (!foundEvent || !user) return; // Ensure event and user exist before proceeding

        // updateEvent({
        //     ...foundEvent,
        //     applications: [...foundEvent.applications, application]
        // });
        setExpanded(null); // Collapse the application form after submission
        setError(null); // Clear any previous errors
    };

    /* TODO this needs to be refactored to use backend api
    
    const addPreferredEvents = (eventID: number) => {
        //adds event to preferred events list, or creates if null
        const currentPreferredEvents = loggedinUser!.preferredEvents || [];
        //checks if already there
        if (currentPreferredEvents.some(event => event.eventId === eventId)) {
            return;
        }
        updateUser({
            ...loggedinUser!,
            preferredEvents: [
                ...(loggedinUser!.preferredEvents || []), 
                events.find((e) => e.eventId === eventId)!]
        });
    };
    */

    if (events.length === 0 || !events) {
        return <h1>No events available.</h1>;
    } else
        return (
            <Box>
                <img src={image} alt={eventName} className="w-full h-24 object-cover mb-4" />
                <h2 className="!text-2xl font-semibold mb-2">{eventName}</h2>
                <div className="grid grid-cols-2">
                    <p className="text-gray-600">Guest: {numberOfGuest}</p>
                    <p className="text-gray-600">Time: {time}</p>
                    <p className="text-gray-600">Duration: {duration} hours</p>
                    <p className="text-gray-600">Date: {date}</p>
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
                                event= {selectedEvent} // Passes the entire event object to the form
                                onSubmit={handleSubmit}
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
                                
                                //TODO reimplement this
                                //onClick={() => addPreferredEvents(eventId)}
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
                            <Button
                                colorScheme='red'
                                type='button'
                                className="float-right w-50 items-center"
                                onClick={() => setExpanded(expanded !== "blockDates" ? "blockDates" : null)}
                            >Block
                            </Button>
                        </Box>
                        {expanded === "viewApplications" && (
                            <Box mt={4} pl={4}>
                                <ApplicantList eventID={eventId} />
                            </Box>
                        )}
                        {expanded === "blockDates" && (
                            <Box mt={4} pl={4}>
                                <ApplicationForm
                                    event={selectedEvent} // Passes the entire event object to the form
                                    onSubmit={handleSubmit} // Passes the eventId to the submit handler
                                    onClose={() => setExpanded(null)}
                                />
                            </Box>
                        )}
                    </>
                ) : null
                )}
            </Box>);
}
