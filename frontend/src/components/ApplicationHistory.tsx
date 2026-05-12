import { Box } from "@chakra-ui/react";
import { Application } from "@/types/application";
import { useEvent } from "@/context/EventContext";
import { useEffect, useState } from "react";
export default function ApplicationHistory({application}: {application: Application}) {
    const { events } = useEvent();
    console.log(events);
    console.log("Application in history component:", application);
    console.log("Application event ID:", application.eventId);
    for (const event of events) {
        if (event.eventId === application.eventId) {
            console.log("Matching event found:", event);
        }
    }
    const eventByApplication = events.find(event => event.eventId === application.eventId);
    console.log("Event by application:", eventByApplication);
    return (
        <Box>
            {eventByApplication ? eventByApplication.eventName : "Unknown Event"}: {application.startDate} to {application.endDate.slice(5)} - Status: {application.status} {application.rating ? `- Rating: ${application.rating}/5` : ""}
        </Box>
    )
}