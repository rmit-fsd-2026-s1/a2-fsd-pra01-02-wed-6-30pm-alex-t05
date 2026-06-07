import { useEffect, useState } from "react";
import { useEvent } from "../context/EventContext";
import { applicationService } from "../services/api";
export const useUserRating = (applicantUserName: string): number | null => {
    const { events } = useEvent();
    const [rating, setRating] = useState<number | null>(null);

    useEffect(() => {
        const fetchUserRating = async () => {
            try {
                const userRating = await applicationService.getRatingForUser(applicantUserName);
                setRating(userRating);
            } catch (error) {
                console.error("Error fetching user rating:", error);
                setRating(null); // Set rating to null if there's an error
            }
        };

        fetchUserRating();
    }, [applicantUserName, events]);
    return rating;
}
//This hook pulls users rating from username