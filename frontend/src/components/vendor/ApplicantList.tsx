import { Box, IconButton } from "@chakra-ui/react";
import { useEvent } from "../../context/EventContext";
import { useState } from "react";
import ApplicantModal from "./modals/ApplicantModal";
import { Application } from "@/types/application";
import { autoDeclineOverlappingApplications, getRatingForUser } from "@/services/applicationService";
import { FaSort } from "react-icons/fa";
import { useUserRating } from "@/hooks/useUserRating";
import { ApplicantRow } from "./ApplicantRow";

export default function ApplicantList({ eventID }: { eventID: number }) {
    //TODO
    //rework date format to be more user friendly

    const { events, updateEvent } = useEvent();
    const event = events.find(e => e.eventID === eventID);
    const applicants = event?.applications || [];
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
    const [sortedByRating, setSortedByRating] = useState(false);
    //visible applicants are those that are pending, or those approved and awaiting a rating
    const visibleApplicants = applicants
    .filter(applicant => 
        applicant.status === "pending" || 
        (applicant.status === "approved" && applicant.rating === null)
    )
    //tack on sort by rating
    .sort((a, b) => {
        if (!sortedByRating) return 0;
        if (a.rating === null) return 1;
        if (b.rating === null) return -1;
        return b.rating - a.rating;
    });
    const selectedApplication = applicants.find(app => app.id === selectedApplicationId);




    const handleUpdateApplication = (updatedApplication: Application) => {
        //select the event that the application belongs to
        const foundEvent = events.find(e => e.eventID === eventID);
        if (!foundEvent) return;

        //replace the application in the event with the updated application
        const updatedApplications = foundEvent.applications.map(app => 
            app.id === updatedApplication.id
                ? updatedApplication
                : app
        );
        //update the event's application/s with the new application status
        const updatedEvent = {
            ...foundEvent,
            applications:
                //if approved, auto decline overlapping applications, otherwise just modify the one app 
                updatedApplication.status === "approved"
                    ? autoDeclineOverlappingApplications({
                        ...foundEvent,
                        applications: updatedApplications
                    }) : updatedApplications
        };
        updateEvent(updatedEvent);
    }
    console.log("applicants" , applicants);
    console.log("visible applicants" , visibleApplicants);

    return (
        <Box p={4} bg="white" rounded="md" shadow="md">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box as="h2">Applicant List for Event ID: {eventID}</Box>
            <IconButton 
                aria-label="Sort by rating" 
                icon={<FaSort />} 
                onClick={() => setSortedByRating(!sortedByRating)}
                variant="ghost"
                
                />
        </Box>
            {visibleApplicants.length === 0 ? (
                <Box as="p">No applicants found for this event.</Box>
            ) : (
                <Box as="ul" mt={2}>
                    {visibleApplicants.map((applicant) => {
                        return (
                            <ApplicantRow
                                key={applicant.id}
                                applicant={applicant}
                                onClick={() => setSelectedApplicationId(applicant.id)}
                            />
                        );
                    })}
                </Box>
            )}
            {selectedApplicationId && (
                <ApplicantModal 
                application={selectedApplication!}
                events={events} 
                onClose={() => setSelectedApplicationId(null)}
                onUpdateApplication ={handleUpdateApplication}
                />
            )}

        </Box>
    );
}