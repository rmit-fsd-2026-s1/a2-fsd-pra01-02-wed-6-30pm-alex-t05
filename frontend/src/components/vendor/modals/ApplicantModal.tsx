import { Box, Button, IconButton, Link } from "@chakra-ui/react";
import { MdClose, MdStar } from "react-icons/md";
import { Application } from "@/types/application";
import { Event } from "@/types/event";
import { setApplicationStatus, setApplicationRating } from "@/services/applicationService";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { useUserRating } from "@/hooks/useUserRating";
import { useAuth } from "@/context/AuthContext";
import { applicationService, userService } from "@/services/api";

export default function ApplicantModal({
    application,
    onClose,
    onUpdateApplication }: {
        application: Application, 
        events: Event[],
        onClose: () => void
        onUpdateApplication: (updatedApplication: Application) => void
    }) {
    const { user } = useAuth();
    const [fullApplicant, setApplicant] = useState<User | null>(null);
    //TODO refactor this to a hook
    useEffect(() => {
        try{
        async function fetchUser() {
            //fetches user details based on url
            const applicant = await userService.getOneUser(application.applicantUserName);
            setApplicant(applicant); //set the profileUser state to the fetched user details
        }
        fetchUser();
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }, [application]); //refetches if profile username query parameter or current user changes
    
    //TODO move this to a hook if we want it used on the hirer profile
    //gets comments on a hirer made by a vendor
    //sets a state to load properly
    const [userComments, setUserComments] = useState<string | null>(null);
    useEffect(() => {
        async function fetchComments() {
            if (!user || !fullApplicant) {
                setUserComments(null); //if there's no user or applicant, set comments to null
                return;
            }
            try{
                const comments = await userService.getUserCommentsFromVendor(user.userName, fullApplicant.userName);
                setUserComments(comments);

            } catch (error) {
                console.error("Error fetching user comments from vendor:", error);
                setUserComments(null);
            }
        }
        fetchComments();
        //rerenders when both users are fully loaded
    }, [user, fullApplicant]);

    const rating = useUserRating(application.applicantUserName);
    const isApproved = application.status === "approved";

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
                    <Link href={`/profile/${fullApplicant?.userName}`} target="_blank" color="blue.500" fontWeight="bold">
                        Open Profile
                    </Link>
                    <p><strong>Name:</strong> {fullApplicant?.firstName} {fullApplicant?.lastName}</p>
                    <p><strong>Email:</strong> {fullApplicant?.email}</p>
                    <p><strong>Phone Number:</strong> {fullApplicant?.phoneNumber || "Not provided"}</p>
                    <p><strong>Rating:</strong> {rating ? `${rating} / 5` : "No ratings yet"}</p>
                    
                    <p><strong>Comment:</strong> {userComments || "No existing comments"}</p>
                    <Button mt={2} colorScheme="blue" onClick={() => {
                        const newComment = prompt("Enter comment for user, set to blank to delete", userComments || "");
                        if (newComment !==null) { //if not cancelled update
                            if (newComment.trim() === "") {
                                //if blank, delete
                                if (userComments) { //only call delete if there's an existing comment to delete
                                    userService.deleteUserCommentFromVendor(user?.userName || "", fullApplicant?.userName || "");
                                    setUserComments(null); //update local state to reflect deletion
                                }
                            } else {
                                userService.setUserCommentFromVendor(user?.userName || "", fullApplicant?.userName || "", newComment);
                                setUserComments(newComment); //update local state to reflect the new comment
                            }
                        };
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
                            onClose();
                        }}>
                            Approve
                        </Button>
                        <Button mt={4} colorScheme="red" onClick={() => {
                            const updated = setApplicationStatus(application, "rejected");
                            onUpdateApplication(updated);
                            onClose();
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