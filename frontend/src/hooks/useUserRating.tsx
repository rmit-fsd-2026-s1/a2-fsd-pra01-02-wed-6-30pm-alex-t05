import { useEffect, useState } from "react";
import { useEvent } from "../context/EventContext";
import { getRatingForUser } from "../services/applicationService";

export const useUserRating = (userName: string): number | null => {
    const { events } = useEvent();
    const [rating, setRating] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserRating = async () => {
            try {
                const userRating = await getRatingForUser(userName);
                setRating(userRating);
            } catch (error) {
                console.error("Error fetching user rating:", error);
                setRating(null); // Set rating to null if there's an error
            }
        };

        fetchUserRating();
    }, [userName, events]);

    return rating;
}
//This hook pulls users rating from username