import { Box } from "@chakra-ui/react";
import { Application } from "@/types/application";
import { useEvent } from "@/context/EventContext";
import { useEffect, useState } from "react";
export default function ApplicationHistory({application}: {application: Application}) {
    const { events } = useEvent();
    const eventByApplication = events.find(event => event.eventId === application.eventId);
    return (
        <Box>
            {eventByApplication ? eventByApplication.eventName : "Unknown Event"}: {application.startDate} to {application.endDate.slice(5)} - Status: {application.status} {application.rating ? `- Rating: ${application.rating}/5` : ""}
        </Box>
    )
}