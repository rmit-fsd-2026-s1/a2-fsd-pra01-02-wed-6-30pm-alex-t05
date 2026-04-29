import { useEvent } from "../context/EventContext";
import { getRatingForUser } from "../services/applicationService";

export const useUserRating = (userName: string): number | null => {
    const { events } = useEvent();
    return getRatingForUser(userName, events)
}
//This hook pulls users rating from username