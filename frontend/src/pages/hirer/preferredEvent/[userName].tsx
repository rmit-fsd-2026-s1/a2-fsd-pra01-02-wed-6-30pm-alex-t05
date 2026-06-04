import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import PreferredEventCard from "@/components/preferredEventCard";
import { Event } from "@/types/event";
import { userService } from '@/services/api';


export default function PreferredEvent() {
    const { user } = useAuth();
    const [preferredEvents, setPreferredEvents] = useState<Event[]>([]);


    const fetchPreferredEvents = async () => {
        try {
            const data = await userService.getAllPreferredEventsForHirer(user?.userName as string);
            setPreferredEvents(data);
        } catch (error) {
            console.error("Error fetching preferred events:", error);
        }
    };

    useEffect(() => {
        if (user?.userName) {
            fetchPreferredEvents();
        }
    }, [user?.userName]);

    /*
    const moveUp = (index: number) => {
        //prevent out of bounds
        if (index === 0) return;
        if (profileUser) {
            const swapEvents = [...profileUser.preferredEvents!];
            const swap = swapEvents[index];
            swapEvents[index] = swapEvents[index - 1];
            swapEvents[index - 1] = swap;
            const updatedUser = {
                ...profileUser!,
                preferredEvents: swapEvents
            };
            //update data in local storage and context
            updateUser(updatedUser);
            login(updatedUser);
            setProfileUser(updatedUser); // Trigger local state update to re-render component
        }
    };
 
    const moveDown = (index: number) => {
        //prevent out of bounds
        if (index === profileUser!.preferredEvents!.length - 1) return;
        if (profileUser) {
            const swapEvents = [...profileUser.preferredEvents!];
            const swap = swapEvents[index];
            swapEvents[index] = swapEvents[index + 1];
            swapEvents[index + 1] = swap;
            const updatedUser = {
                ...profileUser,
                preferredEvents: swapEvents
            };
            //update data in local storage and context
            updateUser(updatedUser);
            login(updatedUser);
            setProfileUser(updatedUser); // Trigger local state update to re-render component
        }
    };
    */

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        (!user || user.role === "hirer") ? ( // This only works if the user is a hirer
            <div className="min-h-screen items-center justify-center bg-gray-100">
                <h1 className="!text-2xl flex items-center justify-center">Preferred Events</h1>
                {preferredEvents === null || preferredEvents.length === 0 ? ( // This checks if events are empty or null
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                            <h1 className="text-2xl font-bold mb-4">No preferred event found</h1>
                        </div>
                    </div>
                ) : (
                    /* Search function
                    include will match the users search and return the event if it matches.
                    filter will get the found events and put in an array */
                    <div className="gap-4">
                        {preferredEvents.map((event) => ( // Map prints the found events
                            <div className="bg-white p-6 ml-3 mr-3 mt-3 rounded-lg shadow-md" key={event.eventId}>
                                <PreferredEventCard
                                    eventId={event.eventId}
                                    eventName={event.eventName}
                                    numberOfGuest={event.numberOfGuest}
                                    address={event.address || "No address provided"}
                                    image={event.image}
                                    shortDescription={event.shortDescription}
                                    isBlocked={event.isBlocked}
                                />
                                {/*}
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button
                                        colorScheme='teal'
                                        type='button'
                                        className="w-15 items-center"
                                        onClick={() => removePreferredEvents(event.eventId)}
                                    >
                                        <MdDelete />
                                    </Button>
                                    <Button
                                        colorScheme='teal'
                                        type='button'
                                        className="w-15 items-center"
                                        onClick={() => moveUp(profileUser.preferredEvents!.indexOf(event))}
                                    >
                                        <MdArrowUpward />
                                    </Button>
                                    <Button
                                        colorScheme='teal'
                                        type='button'
                                        className="w-15 items-center"
                                        onClick={() => moveDown(profileUser.preferredEvents!.indexOf(event))}
                                    >
                                        <MdArrowDownward />
                                    </Button>
                                </div>
                                */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ) : ( // If the user is not a hirer, this will show
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-gray-700">You must be signed in as a hirer to view this page.</p>
                </div>
            </div>
        )
    );
}