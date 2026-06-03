import VisualRepresentation from "@/components/vendor/VisualRepresentation";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { useEvent } from '../../context/EventContext';
import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { eventService } from "@/services/api";
import { useRouter } from "next/router";
import EventFormModal from "@/components/vendor/modals/EventFormModal";

export default function Vendor() {
    const { user } = useAuth()
    const { eventsForVendor } = useEvent();
    const [visualisationsVisible, setVisualisationsVisible] = useState(false);
    const [eventForm, setEventForm] = useState<{mode: "createEvent"} | null>(null);

    const router = useRouter();
    const { userName } = router.query;
    const handleEventFormSubmit = async (event: Event) => {
        await eventService.createEvent(event);
        //this is kinda bad and is a workaround to not having to update event context properly, but it works for now
        router.reload();
    };
    

    return (
        (!user || user.role === "vendor" && user.userName !== userName) ? (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-gray-700">You must be signed in as a vendor to view this page.</p>
                </div>
            </div>
        ) : (
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
                    {eventsForVendor.map((vendorEvent) => (
                        <div className="bg-white p-6 ml-3 mr-3 mt-3 rounded-lg shadow-md" key={vendorEvent.eventId}>
                            <Card
                                eventId={vendorEvent.eventId}
                                eventName={vendorEvent.eventName}
                                numberOfGuest={vendorEvent.numberOfGuest}
                                address={vendorEvent.address || "No address provided"}
                                shortDescription={vendorEvent.shortDescription}
                                image={vendorEvent.image}
                                isBlocked={vendorEvent.isBlocked}
                            />
                        </div>
                    ))}
                </div>
                <div className="fixed bottom-15 right-15 text-white px-4 py-2 rounded-full shadow-md">
                    <Button
                        colorScheme='teal'
                        className="w-50 items-center"
                        type='button'
                        onClick={() => setEventForm({mode: "createEvent"})}>
                        Create New Event
                    </Button>
                    
                </div>
                {eventForm && (
                        <EventFormModal
                            mode = {eventForm.mode}
                            selectedEvent={null}
                            onClose={() => setEventForm(null)}
                            onSubmit={(event) => {handleEventFormSubmit(event); setEventForm(null);}}
                        />
                    )}
            </div>
        )
    );
}