import { Button, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import InputField from "./InputField";
import { createApplication, getBlockedDatesForEvent, normaliseDate, setApplicationStatus } from "@/services/applicationService";
import { validateApplication } from "@/services/applicationService";
import { Application } from "@/types/application";
import { Event } from "@/types/event";
import { useAuth } from "../context/AuthContext";
import { start } from "repl";

type Props = {
    event: Event;
    onSubmit: (eventID: number, application: Application) => void;
};

export default function ApplicationForm({ event, onSubmit }: Props) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errors, setErrors] = useState<null | { startDate?: string; endDate?: string }>(null);
    const { user } = useAuth();
    useEffect(() => {
        //used to reactively validate if set dates are valid
        if (!startDate || !endDate) {
            setErrors(null);
            return;
        }     
        const tempApplication = createApplication(event.eventID, user!.userName, startDate, endDate);
        const validation = validateApplication(tempApplication, event);
        validation ? setErrors({ [validation[0]]: validation[1] }) : setErrors(null);
    }, [startDate, endDate]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "startDate") {
            setStartDate(value);
        } else if (name === "endDate") {
            setEndDate(value);
        }
    };

    const unvailableDates = getBlockedDatesForEvent(event)

    const handleSubmit = () => {
        //prevent submission if there are validation errors
        if (errors) return;
        if (startDate === "" || endDate === "") {
            setErrors({ startDate: "Start date is required.", endDate: "End date is required." });
            return;
        }
        if (user!.role === "hirer") {
            const application = createApplication(event.eventID, user!.userName, startDate, endDate);
            onSubmit(event.eventID, application);
        } else if (user!.role === "vendor") {
            //for blocking dates it creates a dummy application
            const application = setApplicationStatus(createApplication(event.eventID, user!.userName, startDate, endDate), "approved");
            onSubmit(event.eventID, application);
        }
    };

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
                        </p>
                    ))
                )}
            </Box>
        <InputField
            label = "Start Date"
            type = "date"
            name = "startDate"
            value={startDate}
            onChange={handleInputChange}
            error={errors?.startDate}
        />
        <InputField
            label = "End Date"
            type = "date"
            name = "endDate"
            value={endDate}
            onChange={handleInputChange}
            error={errors?.endDate}
        />
        <Button mt={4} colorScheme="teal" onClick={handleSubmit}>
            {user!.role === "hirer" ? "Submit Application" : "Block Dates"}
        </Button>
     </Box>
    );
}
