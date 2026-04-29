import { Box, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useEvent } from '../context/EventContext';
import { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import { Application } from "@/types/application";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";

interface CardProps {
    eventID: number;
    eventName: string;
    numberOfGuest: number;
    date: string;
    time: string;
    duration: number;
    image?: string; // Optional field for event image URL
    //reputation: [];
    isBlocked: boolean;
    shortDescription?: string;
}

export default function PreferredEventCard({ eventID, eventName, numberOfGuest, date, time, duration, image, isBlocked, shortDescription }: CardProps) {
    const { events, updateEvent } = useEvent();
    const { user } = useAuth();
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

    if (events.length === 0 || !events) {
        return <h1>No events available.</h1>;
    } else
        return (
            <>
                <div className='grid grid-cols-3 gap-4'>
                    <img src={image} alt={eventName} className="w-100 h-20 mb-4" />
                    <div className="grid grid-span-2">
                        <h2 className="!text-2xl font-semibold mb-2">{eventName}</h2>
                        <p className="text-gray-600">Guest: {numberOfGuest}</p>
                        <p className="text-gray-600">Time: {time}</p>
                        <p className="text-gray-600">Duration: {duration} hours</p>
                        <p className="text-gray-600">Date: {date}</p>
                        <p className="text-gray-600 mt-2">Description: {shortDescription}</p>
                    </div>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {user && (user.role === "hirer") && (
                    <Box>
                        <Button
                            colorScheme='teal'
                            type='button'
                            className="w-50 items-center"
                            onClick={() => setExpanded(!expanded ? "viewApplications" : null)}
                            isDisabled={isBlocked}
                        >{expanded ? "Hide" : "Apply"}
                        </Button>
                        {expanded && (
                            <Box mt={4} pl={4}>
                                <ApplicationForm
                                    event={events.find((u) => u.eventID === eventID)!} // Passes the entire event object to the form
                                    onSubmit={handleSubmit} // Passes the eventID to the submit handler
                                />
                            </Box>
                        )}
                    </Box>

                )}
                {!user && (
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                            <p className="text-gray-700">
                                You must be signed in to view this page.
                            </p>
                        </div>
                    </div>
                )}
            </>
        );
}
