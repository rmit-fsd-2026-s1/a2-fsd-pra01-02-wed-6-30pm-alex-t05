import { useState, useEffect } from 'react';
import { Button, Input, Icon } from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";
import Card from "@/components/Card";
import { useRouter } from "next/router";
import { AdminService } from "@/services/api";
import { Event } from '@/types/types';

export default function AdminDashboard() {
    const router = useRouter();
    const { userName } = router.query;
    const [userSearch, setUserSearch] = useState('')
    const [events, setEvents] = useState<Event[]>([]);
    const [vendorUserNames, setVendorUserNames] = useState<string[]>([]);

    const fetchEvent = async () => {
        try {
            const data = await AdminService.getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }
    useEffect(() => {
            const fetchVendorUserNames = async () => {
                try {
                    const names = await AdminService.getVendorUserNames();
                    setVendorUserNames(names);
                    console.log("Fetched vendor usernames:", names);
                } catch (error) {
                    console.error("Error fetching vendor usernames:", error);
                }
            };
            fetchVendorUserNames();
        }, []);

    useEffect(() => {
        fetchEvent();
    }, []);

    return (
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
            {(events.length === 0 || events === null) ? (
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
                        e.address?.toLowerCase().includes(userSearch.toLowerCase()) ||
                        e.shortDescription?.toLowerCase().includes(userSearch.toLowerCase()
                        )).map((event) => (
                            <div className="bg-white p-6 ml-3 mr-3 mt-3 rounded-lg shadow-md" key={event.eventId}>
                                <Card
                                    event={event}
                                    vendorUserNames={vendorUserNames}
                                />
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}