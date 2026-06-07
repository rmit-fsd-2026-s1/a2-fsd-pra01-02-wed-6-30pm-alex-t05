import { Box, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/router";
import { useEvent } from "../context/EventContext";
import { AdminService } from "@/services/api";


interface CardProps {
    featuredEventId: string;
    eventName: string;
    numberOfGuest: number;
    address?: string;
    image?: string; // Optional field for event image URL
    shortDescription?: string;
}

export default function FeaturedEventCard({ featuredEventId, eventName, numberOfGuest, address, image, shortDescription }: CardProps) {
    const { admin } = useAuth();
    const router = useRouter();
    const { userName } = router.query;
    const { featuredEvents, fetchFeaturedEvents, fetchEvents } = useEvent();

    const HandleRemove = async (featuredEventId: string) => {
        try {
            await AdminService.deleteFeaturedEvent(featuredEventId);
            fetchFeaturedEvents();
        } catch (error) {
            console.error("Error removing event from featured:", error);
        }
    };

    if (featuredEvents.length === 0 || !featuredEvents) {
        return <h1>No featured events available.</h1>;

    } else {
        return (
            <div>
                {(admin && admin.userName === userName) ? (
                    <div className='grid grid-cols-3 gap-4'>
                        <img src={image} alt={eventName} key={featuredEventId} className="w-100 h-20 mb-4" />
                        <div className="grid grid-span-2">
                            <h2 className="!text-2xl font-semibold mb-2">{eventName}</h2>
                            <p className="text-gray-600">Guest: {numberOfGuest}</p>
                            <p className="text-gray-600">Address: {address}</p>
                            <p className="text-gray-600 mt-2">Description: {shortDescription}</p>
                            <Button colorScheme='teal' type='button' onClick={() => HandleRemove(featuredEventId)}>
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                            <p className="text-gray-700">You must be signed in as a hirer to view this page.</p>
                        </div>
                    </div>
                )
                }
            </div >
        );
    }
}