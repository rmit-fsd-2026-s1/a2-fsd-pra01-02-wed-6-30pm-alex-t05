import { Box } from "@chakra-ui/react";
import { Application } from "@/types/application";
import { useEvent } from "@/context/EventContext";

export default function ApplicationHistory({application}: {application: Application}) {
    const { events } = useEvent();
    return (
        <Box>
            <p>{events.find(e => e.eventId === application.eventId)?.eventName || 'Unknown Event'} |    Application ID: {application.applicationId} - Status: {application.status} - Rating: {application.rating !== null ? application.rating + " / 5" : 'Not Yet Rated'}</p>
        </Box>
    )
}