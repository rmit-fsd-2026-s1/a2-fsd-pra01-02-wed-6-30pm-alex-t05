import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { useEvent } from "../../context/EventContext";
import { useEffect, useState } from "react";
import ApplicantModal from "./modals/ApplicantModal";
import { Application } from "@/types/application";
import { FaSort } from "react-icons/fa";
import { ApplicantRow } from "./ApplicantRow";
import { Event } from "@/types/event";
import { applicationService} from "@/services/api";
export default function ApplicantList({ event }: { event: Event }) {
    
    const { events } = useEvent();
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    //visible applicants are those that are pending, or those approved and awaiting a rating
    const [applicationsForEvent, setApplicationsForEvent] = useState<Application[]>([]);
    const [sortedByRating, setSortedByRating] = useState(false);
    useEffect(() => {
        const fetchApplications = async () => {
            const apps = await applicationService.getApplicationsForEvent(event.eventId);
            setApplicationsForEvent(apps);
        };
        fetchApplications();
    }, [event.eventId]);

    const visibleApplicants = applicationsForEvent.filter(app => 
        app.status === "pending" 
        || (app.status === "approved" 
        && app.rating === null));
    
    const displayedApplicants = sortedByRating ? 
        [...visibleApplicants].sort((a, b) => {
            if (a.rating === null) return 1;
            if (b.rating === null) return -1;
            return b.rating - a.rating;
        }) : 
        visibleApplicants; 
    
    const handleUpdateApplication = (updatedApplication: Application) => {
        //call api put query to update application in backend
        applicationService.updateApplication(updatedApplication)
    }
    return (
        <Box p={4} bg="white" rounded="md" shadow="md">
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={4}>
                <Box as="h2">Applicant List</Box>
                <Tooltip label={sortedByRating ? "Sort by date" : "Sort by rating"}>
                    <IconButton 
                        aria-label="Sort by rating" 
                        icon={<FaSort />} 
                        onClick={() => setSortedByRating(!sortedByRating)}
                        variant="ghost"
                    />
                </Tooltip>
            </Box>
            {displayedApplicants.length === 0 ? (
                <Box as="p">No applicants found for this event.</Box>
            ) : (
                <Box as="ul" mt={2}>
                    {displayedApplicants.map((application) => {
                        return (
                            <ApplicantRow
                                key={application.applicationId}
                                applicant={application}
                                onClick={() => setSelectedApplication(application)}
                            />
                        );
                    })}
                </Box>
            )}
            {selectedApplication && (
                <ApplicantModal 
                application={selectedApplication!}
                events={events} 
                onClose={() => setSelectedApplication(null)}
                onUpdateApplication ={handleUpdateApplication}
                />
            )}
        </Box>
    );
}