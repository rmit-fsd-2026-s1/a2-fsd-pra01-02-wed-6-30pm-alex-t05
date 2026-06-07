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
    const { eventsForVendor, fetchEventsForVendor } = useEvent();
    const [visualisationsVisible, setVisualisationsVisible] = useState(false);
    const [eventForm, setEventForm] = useState<{ mode: "createEvent" } | null>(null);
    const [tags, setTags] = useState<{ eventId: number; tag: string }[]>([]);
    
    async function fetchAllEventTags() {
        const eventTags = await eventService.getAllEventTags();
        setTags(eventTags);
        console.log("Fetched event tags in Vendor profile:", eventTags);
    }
    useEffect(() => {   
        fetchAllEventTags();
    }, [eventsForVendor]);

    const router = useRouter();
    const userName = router.query.userName as string;
    const handleEventFormSubmit = async (event: any) => {
        const updatedEvent: Event = {
            ...event,
            numberOfGuest: parseInt(event.numberOfGuest),
            user: userName
        };
        console.log("Submitting event:", updatedEvent);
        const createdEvent = await eventService.createEvent(updatedEvent);
        await eventService.setTagsForEvent(createdEvent.eventId, event.tags);
        setEventForm(null); // Close the event form modal after submission
        fetchAllEventTags(); // Refetch tags to ensure the new event's tags are included
        await fetchEventsForVendor(); // Fetchs all vendor events again to update the list
    };
    useEffect(() => {
        fetchEventsForVendor();
    }, [userName]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (!user || user.role === "vendor" && user.userName !== userName) ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-gray-700">You must be signed in as a vendor to view this page.</p>
            </div>
        </div>
    ) : (eventsForVendor === null || eventsForVendor.length === 0) ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                <h1 className="text-2xl font-bold mb-4">No events found</h1>
                <p className="text-gray-700">You have not created any events yet.</p>
            </div>
        </div>
    ) : (
        <div className="min-h-screen items-center justify-center bg-gray-100">
            <Box>
                <Button colorScheme='teal' type='button'
                    onClick={
                        () => {
                            setVisualisationsVisible(!visualisationsVisible);
                        }
                    }>
                    {visualisationsVisible ? "Hide Visualisations" : "Show Visualisations"}
                </Button >
                {visualisationsVisible &&
                    <VisualRepresentation />
                }
            </Box >
            <h1 className="!text-2xl flex items-center justify-center">Venue List</h1>
            <div className="grid grid-cols-2 gap-4">
                {eventsForVendor.map((vendorEvent) => (
                    <div className="bg-white p-6 ml-3 mr-3 mt-3 rounded-lg shadow-md" key={vendorEvent.eventId}>
                        <Card
                            event={vendorEvent}
                            tags={tags.filter(t => t.eventId === vendorEvent.eventId).map(t => t.tag)}
                        />
                    </div>
                ))}
            </div>
            <div className="fixed bottom-15 right-15 text-white px-4 py-2 rounded-full shadow-md">
                <Button
                    colorScheme='teal'
                    className="w-50 items-center"
                    type='button'
                    onClick={() => setEventForm({ mode: "createEvent" })}>
                    Create New Event
                </Button>

            </div>
            {
                eventForm && (
                    <EventFormModal
                        mode={eventForm.mode}
                        selectedEvent={null}
                        onClose={() => setEventForm(null)}
                        onSubmit={(event) => { handleEventFormSubmit(event); setEventForm(null); }}
                    />
                )
            }
        </div >
    );
}