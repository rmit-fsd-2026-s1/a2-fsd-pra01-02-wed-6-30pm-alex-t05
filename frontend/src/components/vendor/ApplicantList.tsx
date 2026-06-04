import { Box, IconButton } from "@chakra-ui/react";
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
    
    const [sortedByRating, setSortedByRating] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    //visible applicants are those that are pending, or those approved and awaiting a rating
    const [applicationsForEvent, setApplicationsForEvent] = useState<Application[]>([]);
    useEffect(() => {
        const fetchApplications = async () => {
            const apps = await applicationService.getApplicationsForEvent(event.eventId);
            setApplicationsForEvent(apps);
        };
        fetchApplications();
        //rerenders the application list when an application is selected, so that the modal can show updated information after an application is approved/declined
    } , [selectedApplication, applicationsForEvent, events]);

    //tack on sort by rating
    useEffect(() => {
        if (sortedByRating) {
            const sortedApplications = [...visibleApplicants].sort((a, b) => {
                if (a.rating === null) return 1;
                if (b.rating === null) return -1;
                return b.rating - a.rating;
            });
            setApplicationsForEvent(sortedApplications);
        } else {
            //if we're toggling off sorting, we need to reapply the default order (which is by application date, but since we don't have that, we'll just pull from the backend again)
            const fetchApplications = async () => {
                const apps = await applicationService.getApplicationsForEvent(event.eventId);
                setApplicationsForEvent(apps);
            };
            fetchApplications();
        }
    }, [sortedByRating]);

    //TODO consider moving this filtering logic to the backend, so that we can sort by rating without having to pull all applications for the event
    const visibleApplicants = applicationsForEvent.filter(app => 
        app.status === "pending" 
        || (app.status === "approved" 
        && app.rating === null));

    const handleUpdateApplication = (updatedApplication: Application) => {
        //call api put query to update application in backend
        applicationService.updateApplication(updatedApplication)
    }
    return (
        <Box p={4} bg="white" rounded="md" shadow="md">
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={4}>
                <Box as="h2">Applicant List</Box>
                <IconButton 
                    aria-label="Sort by rating" 
                    icon={<FaSort />} 
                    onClick={() => setSortedByRating(!sortedByRating)}
                    variant="ghost"
                    justifySelf="end"
                    />
        </Box>
            {visibleApplicants.length === 0 ? (
                <Box as="p">No applicants found for this event.</Box>
            ) : (
                <Box as="ul" mt={2}>
                    {visibleApplicants.map((application) => {
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