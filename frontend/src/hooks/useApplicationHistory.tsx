import { useEvent } from "@/context/EventContext";
import { getApplicationsForUser } from "@/services/applicationService";
export default function useApplicationHistory(userName: string) {
    const { events } = useEvent();
    return getApplicationsForUser(userName, events);
}