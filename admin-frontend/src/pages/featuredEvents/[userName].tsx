import { useAuth } from "../../context/AuthContext";
import FeaturedEventCard from "../../components/featuredEventCard";
import { useEvent } from '../../context/EventContext';
import { useRouter } from "next/router";
import Header from "../../components/Header";
import { Button } from "@chakra-ui/react";


export default function PreferredEvent() {
    const router = useRouter();
    const { userName } = router.query;
    const { admin } = useAuth()
    const { fetchFeaturedEvents, featuredEvents } = useEvent();

    console.log("Featured Events:", featuredEvents); // Log the featured events to check if they are being fetched correctly
    if (!admin) {
        return <div>Loading...</div>;
    }

    return (admin && admin.userName === userName) ? (
        <>
            <Header />
            <div className="min-h-screen items-center justify-center bg-gray-100">
                <h1 className="!text-2xl flex items-center justify-center">Venue List</h1>
                {(featuredEvents.length === 0 || featuredEvents === null) ? (
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                            <h1 className="text-2xl font-bold mb-4">No event found</h1>
                        </div>
                    </div>
                ) : (
                    /* include will get userSearch(useState) with the events and see what matches.
                    filter will get the found events and return them */
                    <div className="grid grid-cols-2 gap-4">
                        {featuredEvents.map((featuredEvents) => (
                            <div>
                                <div className="bg-white p-6 ml-3 mr-3 mt-3 rounded-lg shadow-md">
                                    <FeaturedEventCard
                                        featuredEventId={featuredEvents.event.eventId}
                                        eventName={featuredEvents.event.eventName}
                                        numberOfGuest={featuredEvents.event.numberOfGuest}
                                        address={featuredEvents.event.address || "No address provided"}
                                        image={featuredEvents.event.image}
                                        shortDescription={featuredEvents.event.shortDescription}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-gray-700">You must be signed in as a hirer to view this page.</p>
            </div>
        </div>
    );
}