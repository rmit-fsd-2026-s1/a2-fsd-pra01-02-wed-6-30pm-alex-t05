import { useAuth } from "@/context/AuthContext";
import { MdDelete } from "react-icons/md";
import { Button } from "@chakra-ui/react";
import PreferredEventCard from "@/components/preferredEventCard";
import { userService } from '@/services/api';
import { useEvent } from "@/context/EventContext";


export default function PreferredEvent() {
    const { user } = useAuth();
    const { eventsForHirer } = useEvent();
    const { fetchPreferredForHirer } = useEvent();



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

    const deletePreferredEvent = async (eventId: number) => {
        try {
            await userService.deletePreferredEventForUser(user!.userName, eventId);
            fetchPreferredForHirer(); // Refresh the preferred events list after deletion
        } catch (error) {
            console.error("Failed to delete preferred event:", error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        (!user || user.role === "hirer") ? ( // This only works if the user is a hirer
            <div className="min-h-screen items-center justify-center bg-gray-100">
                <h1 className="!text-2xl flex items-center justify-center">Preferred Events</h1>
                {eventsForHirer === null || eventsForHirer.length === 0 ? ( // This checks if events are empty or null
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
                        {eventsForHirer.map((preferredEvent, index) => ( // Map prints the found events
                            <div className="bg-white p-6 ml-3 mr-3 mt-3 rounded-lg shadow-md" key={preferredEvent.event.eventId}>
                                <div className="text-lg font-bold float-right">Rank {index + 1}</div>
                                <PreferredEventCard
                                    eventId={preferredEvent.event.eventId}
                                    eventName={preferredEvent.event.eventName}
                                    numberOfGuest={preferredEvent.event.numberOfGuest}
                                    address={preferredEvent.event.address || "No address provided"}
                                    image={preferredEvent.event.image}
                                    shortDescription={preferredEvent.event.shortDescription}
                                    isBlocked={preferredEvent.event.isBlocked}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button
                                        colorScheme='teal'
                                        type='button'
                                        className="w-15 items-center"
                                        onClick={() => deletePreferredEvent(preferredEvent.event.eventId)}>
                                        <MdDelete />
                                    </Button>
                                </div>
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