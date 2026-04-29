import { Box, Button, IconButton, Spinner } from "@chakra-ui/react";
import { MdClose, MdStar } from "react-icons/md";
import { Application } from "@/types/application";
import { getUserByUserName } from "@/services/userService";
import { getRatingForUser } from "@/services/applicationService";
import { Event } from "@/types/event";
import { setApplicationStatus, setApplicationRating, setCommentToApplication } from "@/services/applicationService";
import { useEffect } from "react";

//TODO 
//Complaince Docs
//Link to applicant profile
//A bit better feedback on actions
//Rating system is a bit odd styling wise, but functional
//Kind of hard to follow atm

export default function ApplicantModal({
    application,
    events,
    onClose,
    onUpdateApplication }: {
        application: Application, 
        events: Event[],
        onClose: () => void
        onUpdateApplication: (updatedApplication: Application) => void
    }) {
    const user = getUserByUserName(application.applicantUserName); // Fetch full user details using the applicant's username
    const rating = getRatingForUser(application.applicantUserName, events);
    console.log("events in ApplicantModal:", events);
    console.log("ApplicantModal - user:", user);
    console.log("ApplicantModal - rating:", rating);
    if (!user || !application) {
        return (
            <Box>
                <p>User or application not found</p>
            </Box>
        );
    }
    const isApproved = application.status === "approved";

    useEffect(() => {
        
    }, [application]);

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="blackAlpha.600"
            zIndex={1000}
            onClick={onClose}
        >
            <Box bg="white" p={6} rounded="md" shadow="md" onClick={(e) => e.stopPropagation()} width="400px">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box as="h2" mb={4}>Applicant Details</Box>
                    <IconButton
                        aria-label="Close"
                        icon={<MdClose />}
                        size="sm"
                        variant="ghost"
                        onClick={() => onClose()}
                    />
                </Box>
                <Box>
                    <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Phone Number:</strong> {user?.phoneNumber || "Not provided"}</p>
                    <p><strong>Rating:</strong> {rating ? `${rating} / 5` : "No ratings yet"}</p>
                    <p><strong>Comment:</strong> {application.comment || "No comment provided"}</p>
                    <Button mt={2} colorScheme="blue" onClick={() => {
                        const newComment = prompt("Enter your comment for this application:", application.comment || "");
                        if (newComment !== null) {
                            const updated = setCommentToApplication(application, newComment);
                            onUpdateApplication(updated);
                        }
                    }}>
                        Add/Edit Comment
                    </Button>
                    {/* Additional applicant details and compliance docs can be displayed here */} 
                </Box>
                {!isApproved ? (
                    //approval buttons only show if the application is not already approved, once approved they can only be rated and commented on
                    <Box>
                        <Button mt={4} colorScheme="teal" onClick={() => {
                            const updated = setApplicationStatus(application, "approved");
                            onUpdateApplication(updated);
                        }}>
                            Approve
                        </Button>
                        <Button mt={4} colorScheme="red" onClick={() => {
                            const updated = setApplicationStatus(application, "rejected");
                            onUpdateApplication(updated);
                        }}>
                            Reject
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <p>Rate this applicant:</p>
                        <Box display="flex" gap={2}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <IconButton
                                    key={star}
                                    aria-label={`Rate ${star} Stars`}
                                    icon={<MdStar />}
                                    variant="ghost"
                                    color="gray"
                                    _hover={{ color: "yellow.400", transform: "scale(1.2)" }}
                                    onClick={() => {
                                        const updated = setApplicationRating(application, star);
                                        onUpdateApplication(updated);
                                        onClose();
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}