import { Box } from "@chakra-ui/react";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { useEvent } from '../context/EventContext';
import { useState } from "react";
import { getUserByUserName } from "@/services/userService";
import ApplicantModal from "@/components/vendor/modals/ApplicantModal";
//TODO
//view list of hirer applicants
//view hirers details and compliance docs
//select applicants and make comments and approve and confirm booking

export default function Vendor() {
    const { user } = useAuth()
    const { events } = useEvent();
    
    return (
        user && user.role === "vendor" ? (
            <div className="min-h-screen items-center justify-center bg-gray-100">
                <h1 className="!text-2xl flex items-center justify-center">Venue List</h1>
                <div className="grid grid-cols-2 gap-4">
                    {events.map((event) => (event.owner === user.userName) && (
                        <div className="bg-white p-6 ml-3 mr-3 mt-3 rounded-lg shadow-md" key={event.eventID}>
                            <Card
                                eventID={event.eventID}
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