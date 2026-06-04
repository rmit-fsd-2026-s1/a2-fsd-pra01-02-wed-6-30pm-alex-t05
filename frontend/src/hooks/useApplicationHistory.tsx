import { useEvent } from "@/context/EventContext";
import { Application } from "@/types/application";
import { useEffect, useState } from "react";
import { applicationService } from "@/services/api";

export default function useApplicationHistory(userName: string) {
    const { events } = useEvent();
    const [applicationHistory, setApplicationHistory] = useState<Application[]>([]);

    useEffect(() => {
        const fetchApplicationHistory = async () => {
            try {
                const applications = await applicationService.getApplicationsForUser(userName);
                                
                setApplicationHistory(applications);
            } catch (error) {
                console.error("No history found:", error);
                setApplicationHistory([]); //error and no history set to empty array
            }
        };
        fetchApplicationHistory();
    }, [userName, events]);

    return applicationHistory;
}