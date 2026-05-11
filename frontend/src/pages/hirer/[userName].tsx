import { useState } from 'react';
import { Button, Input, Icon } from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";
import { MdSearch } from "react-icons/md";
import Card from "../../components/Card";
import { useEvent } from '../../context/EventContext';
import { useRouter } from "next/router";

export default function Hirer() {
    const router = useRouter();
    const { userName } = router.query;
    const { user } = useAuth()
    const { events } = useEvent();
    const [userSearch, setUserSearch] = useState('')
    return (
        user && user.role === "hirer" ? (
            <div className="min-h-screen items-center justify-center bg-gray-100">
                <h1 className="!text-2xl flex items-center justify-center">Venue List</h1>
                <form className="flex items-center">
                    <Icon as={MdSearch} mr="1" boxSize={6} className="!text-3x1" />
                    <Input id='search'
                        type='text'
                        placeholder='Search...'
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <Button colorScheme='teal' type='button' className="w-30 items-center">
                        Search
                    </Button>
                </form>
                {events.length === 0 || events === null ? (
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                            <h1 className="text-2xl font-bold mb-4">No event found</h1>
                        </div>
                    </div>
                ) : (
                    /* include will get userSearch(useState) with the events and see what matches.
                    filter will get the found events and return them */
                    <div className="grid grid-cols-2 gap-4">
                        {events.filter(e =>
                            e.eventName.toLowerCase().includes(userSearch.toLowerCase()) ||
                            e.numberOfGuest.toString().includes(userSearch.toLowerCase()) ||
                            e.date.toLowerCase().includes(userSearch.toLowerCase()) ||
                            e.time.toLowerCase().includes(userSearch.toLowerCase()) ||
                            e.duration.toString().includes(userSearch.toLowerCase()) ||
                            e.shortDescription?.toLowerCase().includes(userSearch.toLowerCase()
                            )).map((event) => (
                                <div className="bg-white p-6 ml-3 mr-3 mt-3 rounded-lg shadow-md" key={event.eventId}>
                                    <Card
                                        eventID={event.eventId}
                                        eventName={event.eventName}
                                        numberOfGuest={event.numberOfGuest}
                                        date={event.date}
                                        time={event.time}
                                        duration={event.duration}
                                        image={event.image}
                                        shortDescription={event.shortDescription}
                                        isBlocked={event.isBlocked}
                                    />
                                </div>
                            ))}
                    </div>
                )}
            </div>
        ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-gray-700">You must be signed in as a hirer to view this page.</p>
                </div>
            </div>
        )
    );
}