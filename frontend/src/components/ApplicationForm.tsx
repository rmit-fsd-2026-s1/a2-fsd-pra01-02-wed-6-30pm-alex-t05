import { Button, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import InputField from "./InputField";
import { createApplication, normaliseDate } from "@/services/applicationService";
import { Application } from "@/types/application";
import { Event } from "@/types/event";
import { useAuth } from "../context/AuthContext";
import { applicationService } from "@/services/api";

export default function ApplicationForm({
    event, 
    onSubmit,
    onClose}:  {
        event: Event,
        onSubmit: (application: Application) => void,
        onClose: () => void,
    }) {
    //TODO needs to include more fields for hiring request
    const { user } = useAuth();
    const applicantUserName = user?.userName || "";

    const [formData, setFormData] = useState({
        eventId: event.eventId,
        applicantUserName: applicantUserName,
        startDate: "",
        endDate: "",
        status: "",
        guests: "",
        rating: "",
    });
    useEffect(() => {
        //ensure formdata is populated correctly as props are loaded
        setFormData({
            ...formData,
            eventId: event.eventId,
            applicantUserName: applicantUserName,
        });
        if (user!.role === "hirer") {
            setFormData((prev) => ({
                ...prev,
                status: "pending",
            }));
        } else if (user!.role === "vendor") {
            setFormData((prev) => ({
                ...prev,
                status: "approved",
            }));
        }
    }, [event.eventId, applicantUserName]);
    //populate unavailable dates for the event on component load
    const [unvailableDates, setUnavailableDates] = useState<{ startDate: string; endDate: string, applicantUserName : string; applicationId: number }[]>([]);
    useEffect(() => {
        const fetchUnavailableDates = async () => {
            try {
                const dates = await applicationService.getUnavailableDatesForEvent(event.eventId);
                setUnavailableDates(dates);
                console.log("Fetched unavailable dates:", dates);
                console.log("you are:", user?.userName);
                dates.forEach(date => {
                    console.log(`Date range: ${date.startDate} to ${date.endDate}, booked by ${date.applicantUserName}`);
                });
            } catch (error) {
                console.error("Error fetching unavailable dates:", error);
            }
        };
        fetchUnavailableDates();
    }, [event.eventId]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.startDate) {
            newErrors.startDate = "Start date is required.";
        }
        if (!formData.endDate) {
            newErrors.endDate = "End date is required.";
        }
        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            newErrors.endDate = "End date must be after start date.";
        }
        //check for overlapping dates with unavailable dates
        if (formData.startDate && formData.endDate) {
            if (unvailableDates.some(dateRange => 
                (formData.startDate >= dateRange.startDate && formData.startDate <= dateRange.endDate) ||
                (formData.endDate >= dateRange.startDate && formData.endDate <= dateRange.endDate) ||
                (formData.startDate <= dateRange.startDate && formData.endDate >= dateRange.endDate)
            )) {
                newErrors.startDate = "Selected dates overlap with unavailable dates.";
                newErrors.endDate = "Selected dates overlap with unavailable dates.";
            }
        }
        if (!formData.guests) {
            newErrors.guests = "Number of guests is required.";
        } else {
            if (user?.role === "hirer") {
                const guestsNumber = parseInt(formData.guests);
                if (isNaN(guestsNumber)) {
                    newErrors.guests = "Number of guests must be a valid number.";
                }
                if (guestsNumber % 1 !== 0) {
                    newErrors.guests = "Number of guests must be a whole number.";
                }
                if (guestsNumber <= 0) {
                    newErrors.guests = "Number of guests must be greater than zero.";
                }
                if (guestsNumber > event.numberOfGuest) {
                    newErrors.guests = `Number of guests cannot exceed event capacity of ${event.numberOfGuest}.`;
                }
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear the error for this field when the user starts typing
        if (errors && errors[e.target.name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [e.target.name]: ""
            });
        }
    };

    //const unvailableDates = getBlockedDatesForEvent(event)
    const handleSubmit = () => {
        //prevent submission if there are validation errors
        if (!validateForm()) {
            return;
        }
        if (user!.role === "vendor") {
            // For vendors, we want to create a blocking application with the status "approved"
            formData.status = "approved";
            formData.guests = "0";
            formData.rating = "0";
        } else if (user!.role === "hirer") {
            // For hirers, we want to create a pending application
            formData.status = "pending";
        }
        const newApplication = createApplication(
            formData.eventId, 
            formData.applicantUserName,
            formData.startDate,
            formData.endDate,
            formData.status as "pending" | "approved",
            parseInt(formData.guests),
            formData.rating ? parseInt(formData.rating) : undefined
        );
        onSubmit(newApplication);
        onClose();
    };

    const cancelBlock = async (dateRange: { startDate: string; endDate: string; applicantUserName: string, applicationId: number }) => {
        const applicationToCancel = createApplication(
            event.eventId,
            dateRange.applicantUserName,
            dateRange.startDate,
            dateRange.endDate,
            "rejected", // Set status to rejected to cancel the block
            0, // guests is not relevant for blocks
            0 // rating is not relevant for blocks
        );
        applicationToCancel.applicationId = dateRange.applicationId; // Set the applicationId to identify which application to update
        console.log("Cancelling block for application:", applicationToCancel);
        await applicationService.updateApplication(applicationToCancel)
        onClose();
    }
        

    return (
        <Box p={4}>
            <Box mb={4} fontSize="xl" fontWeight="bold">
                <p>Unavailable Dates:</p>
                {unvailableDates.length === 0 ? (
                    <p>None</p>
                ) : (
                    //displays unavailable dates and sorts by end date
                    unvailableDates
                    .filter(dateRange => dateRange.endDate > normaliseDate(new Date().toISOString())) // Filter out past dates
                    .sort((a, b) => a.endDate.localeCompare(b.endDate)) // Sort by end date
                    .map((dateRange, index) => (
                        <p key={index}>
                            {dateRange.startDate} to {dateRange.endDate}
                            {dateRange.applicantUserName == user?.userName && <Button onClick={() => cancelBlock(dateRange)} variant="link" color="blue"> Cancel Block </Button>}
                        </p>
                    ))
                )}
            </Box>
        <InputField
            label = "Start Date"
            type = "date"
            name = "startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            error={errors?.startDate}
        />
        <InputField
            label = "End Date"
            type = "date"
            name = "endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            error={errors?.endDate}
        />
        <InputField
            label = "Number of Guests"
            type = "number"
            name = "guests"
            value={formData.guests}
            onChange={handleInputChange}
            error={errors?.guests}
        />
        {/* hidden field to allow vendors to set their own rating to 0 */}
        <InputField
            label = "Rating"
            type = "hidden"
            name = "rating"
            value={""}
            onChange={handleInputChange}
            
        />
        <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
            {user!.role === "hirer" ? "Submit Application" : "Block Dates"}
        </Button>
     </Box>
    );
}
