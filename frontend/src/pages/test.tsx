import { useEffect, useState } from "react";
import { eventService } from "../services/api";
import { Event } from "../types/event";
import { useEvent } from "@/context/EventContext";


export default function Test() {
    const { events } = useEvent();

    console.log("events state:", events);

    return (
        <div className="min-h-screen items-center justify-center bg-gray-100">
            <h1 className="!text-2xl flex items-center justify-center">Test List</h1>
            <div className="grid grid-cols-2 gap-4">
                {events.map((event) => (
                    <div key={event.eventId}>
                        <p>{event.eventName}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}