import { Box, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useEvent } from '../context/EventContext';
import { useState } from "react";
import ApplicantList from "./vendor/ApplicantList";
import ApplicationForm from "./ApplicationForm";
import { Application } from "@/types/application";
import { updateUser } from "@/services/userService";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface CardProps {
    eventID: number;
    eventName: string;
    numberOfGuest: number;
    date: string;
    time: string;
    duration: number;
    image?: string; // Optional field for event image URL
    isBlocked: boolean;
    shortDescription?: string;
}

export default function Card({ eventID, eventName, numberOfGuest, date, time, duration, image, isBlocked, shortDescription }: CardProps) {
    const { events, updateEvent } = useEvent();
    const { user } = useAuth();
    const loggedinUser = useCurrentUser();
    const [expanded, setExpanded] = useState<"viewApplications" | "blockDates" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (eventID: number, application: Application) => { // Puts in the eventID value
        const foundEvent = events.find((u) => u.eventID === eventID);
        if (!foundEvent || !user) return; // Ensure event and user exist before proceeding

        updateEvent({
            ...foundEvent,
            applications: [...foundEvent.applications, application]
        });
        setExpanded(null); // Collapse the application form after submission
        setError(null); // Clear any previous errors
    };

    const addPreferredEvents = (eventID: number) => {
        //adds event to preferred events list, or creates if null
        const currentPreferredEvents = loggedinUser!.preferredEvents || [];
        //checks if already there
        if (currentPreferredEvents.some(event => event.eventID === eventID)) {
            return;
        }
        updateUser({
            ...loggedinUser!,
            preferredEvents: [
                ...(loggedinUser!.preferredEvents || []), 
                events.find((e) => e.eventID === eventID)!]
        });
    };

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
                {user && (user.role === "hirer" ? (
                    <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                        <Button
                            colorScheme='teal'
                            type='button'
                            onClick={() => setExpanded(!expanded ? "viewApplications" : null)}
                            isDisabled={isBlocked}
                        >{expanded ? "Hide" : "Apply"}
                        </Button>

                        <Button
                            colorScheme='teal'
                            type='button'
                            onClick={() => addPreferredEvents(eventID)}
                        >Save Preferrences
                        </Button>
                    </Box>
                ) : user.role === "vendor" ? (
                    <>
                        <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                            <Button
                                colorScheme='teal'
                                type='button'
                                className="w-50 items-center"
                                onClick={() => {
                                    setExpanded(expanded !== "viewApplications" ? "viewApplications" : null);
                                    console.log(`Selected Event ID: ${eventID}`);
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
                                <ApplicantList eventID={eventID} />
                            </Box>
                        )}
                        {expanded === "blockDates" && (
                            <Box mt={4} pl={4}>
                                <ApplicationForm
                                    event={events.find((u) => u.eventID === eventID)!} // Passes the entire event object to the form
                                    onSubmit={handleSubmit} // Passes the eventID to the submit handler
                                />
                            </Box>
                        )}
                    </>
                ) : null
                )}
            </Box>);
}
