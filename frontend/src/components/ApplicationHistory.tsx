import { Box } from "@chakra-ui/react";
import { Application } from "@/types/application";
import { useEvent } from "@/context/EventContext";
export default function ApplicationHistory({application}: {application: Application}) {
    const { events } = useEvent();
    const eventName = events.find(e => e.eventID === application.eventID)?.eventName || "Unknown Event";
    return (
        <Box>
            {eventName}: {application.startDate} to {application.endDate.slice(5)} - Status: {application.status} {application.rating ? `- Rating: ${application.rating}/5` : ""}
        </Box>
    )}