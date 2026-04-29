import { Box } from "@chakra-ui/react";
import { useUserRating } from "@/hooks/useUserRating";
import { Application } from "@/types/application";


export function ApplicantRow({applicant, onClick} : {applicant: Application, onClick: () => void}) {

    function colourBg() {
        if (applicant.status === "approved") {
            return "green.100";
        } else if (applicant.status === "rejected") {
            return "red.100";
        }else if (applicant.status === "pending") {
            return "yellow.100";
        }
        else {
            return "gray.100";
        }
    }
    const bg = colourBg();

    const rating = useUserRating(applicant.applicantUserName);

    return (
        <Box 
            onClick={onClick} 
            cursor="pointer" 
            p={2} 
            bg={bg}
            rounded="md" 
            mb={2}>
                {applicant.applicantUserName} {applicant.startDate} to {applicant.endDate.slice(5)} - {rating ? `Rating: ${rating}/5` : "No rating yet"}
        </Box>
    );

}