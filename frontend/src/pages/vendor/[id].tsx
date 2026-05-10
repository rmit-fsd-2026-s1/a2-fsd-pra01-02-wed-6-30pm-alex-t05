import VisualRepresentation from "@/components/vendor/VisualRepresentation";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from '../../context/EventContext';
import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { Event } from "../../types/event";
import { eventService } from "@/services/api";
import { useRouter } from "next/router";

export default function Vendor() {
    const { user } = useAuth()
    const { events, eventByUser } = useEvent();
    const [visualisationsVisible, setVisualisationsVisible] = useState(false);

    console.log("events state:", events);
    console.log("user state:", user);
    console.log("eventsByUser state:", eventByUser);

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
                    {events.map((event) => (event.userUserName === user.userName) && (
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