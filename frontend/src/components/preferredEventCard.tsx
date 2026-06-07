import { Box, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useEvent } from '../context/EventContext';
import { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import { Application } from "@/types/application";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import { applicationService } from "@/services/api";
import { Event } from "@/types/event";

interface CardProps {
    event: Event;
}

export default function PreferredEventCard({ event }: CardProps) {
    const { events } = useEvent();
    const { user } = useAuth();
    const [expanded, setExpanded] = useState<"viewApplications" | "blockDates" | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleApplicationSubmit = (application: Application) => {
            console.log("Submitting application:", application);
            applicationService.submitApplication(application);
            setExpanded(null); // Collapse the application form after submission
        };

    if (!events || events.length === 0) {
        return <h1>No events available.</h1>;
    } else
        return (
            <>
                <div className='grid grid-cols-3 gap-4'>
                    <img src={event.image} alt={event.eventName} className="w-100 h-20 mb-4" />
                    <div className="grid grid-span-2">
                        <h2 className="!text-2xl font-semibold mb-2">{event.eventName}</h2>
                        <p className="text-gray-600">Guest: {event.numberOfGuest}</p>
                        <p className="text-gray-600">Address: {event.address}</p>
                        <p className="text-gray-600 mt-2">Description: {event.shortDescription}</p>
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
                            isDisabled={event.isBlocked}
                        >{expanded ? "Hide" : "Apply"}
                        </Button>
                        {expanded && (
                            <Box mt={4} pl={4}>
                                <ApplicationForm
                                    event={event} // Passes the entire event object to the form
                                    onSubmit={handleApplicationSubmit} // Passes the eventId to the submit handler
                                    onClose={() => setExpanded(null)} // Closes the form when the user clicks outside or submits
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
