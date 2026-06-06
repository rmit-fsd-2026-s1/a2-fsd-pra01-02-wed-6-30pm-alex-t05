import { useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { AdminService } from '../services/api';
export default function Test() {


    const fetchEvent = async () => {
        try {
            const data = await AdminService.getAllEvents();
            console.log(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    useEffect(() => {
        fetchEvent();
    }, []);

    return (
        <div>


        </div>
    );
}
