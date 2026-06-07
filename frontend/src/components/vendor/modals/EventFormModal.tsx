import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Event } from "@/types/event";
import InputField from "@/components/InputField";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import TagCheckBox from "@/components/TagsCheckbox";
export default function EventFormModal({
    mode,
    selectedEvent,
    onClose,
    onSubmit }: {
        mode: "createEvent" | "editEvent",
        selectedEvent: Event | null,
        onClose: () => void,
        onSubmit: (eventData: any) => void
}) {
    const owner = useAuth().user?.userName || "";

    //set defaults on mount if in edit mode
    useEffect(() => {
        if (mode === "editEvent" && selectedEvent) {
            setFormData({
                eventName: selectedEvent.eventName,
                image: selectedEvent.image || "",
                numberOfGuest: selectedEvent.numberOfGuest.toString(),
                shortDescription: selectedEvent.shortDescription || "",
                address: selectedEvent.address || "",
                user: selectedEvent.user,
                tags: [],
            });
        }
    }, [owner]);
    console.log("Selected event for editing:", selectedEvent, "Owner:", owner);

    const [formData, setFormData] = useState({
        eventName: mode === "editEvent" && selectedEvent ? selectedEvent.eventName : "",
        numberOfGuest: mode === "editEvent" && selectedEvent ? selectedEvent.numberOfGuest.toString() : "",
        shortDescription: mode === "editEvent" && selectedEvent ? selectedEvent.shortDescription || "" : "",
        image: mode === "editEvent" && selectedEvent ? selectedEvent.image || "" : "",
        address: mode === "editEvent" && selectedEvent ? selectedEvent.address || "" : "",
        user: owner,
        tags: [] as string[],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear the error for this field when the user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ""
            });
        }
    };
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.eventName.trim()) {
            newErrors.eventName = "Event name is required.";
        }
        if (!formData.numberOfGuest.trim() || isNaN(Number(formData.numberOfGuest)) || Number(formData.numberOfGuest) <= 0) {
            newErrors.numberOfGuest = "Please enter a valid number of guests.";
        }
        if (!formData.shortDescription.trim()) {
            newErrors.shortDescription = "Description is required.";
        }
        if (!formData.image.trim()) {
            newErrors.image = "Image URL is required.";
        } else if (!/^https?:\/\/[^\s]+\.[^\s]+$/.test(formData.image.trim())) {
            newErrors.image = "Please enter a valid image URL.";
        }
        //TODO add any other necessary validation
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 ? null : "Please fix the errors in the form.";
    }
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
            onClick={onClose}>
                <Box bg="white" p={6} rounded="md" shadow="md" onClick={(e) => e.stopPropagation()} width="400px">
                    {mode === "editEvent" ? (
                        <Box as="h2" mb={4}>Edit Event</Box>
                    ) : (
                        <Box as="h2" mb={4}>Create Event</Box>
                    )}
                    {/*TODO implement form*/}
                    <FormControl>
                        <TagCheckBox 
                            eventId={mode === "editEvent" && selectedEvent ? selectedEvent.eventId : undefined}
                            value={formData.tags}
                            onChange={(tags) => {
                                setFormData({ ...formData, tags });
                            }}
                        />
                        <InputField
                            label="Event Name"
                            name="eventName"
                            value={formData.eventName}
                            onChange={handleInputChange}
                            error={errors.eventName}
                        />
                        <InputField
                            label="Image URL"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            error={errors.image}
                        />
                        <InputField
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            error={errors.address}
                        />
                        <InputField
                            label="Occupancy"
                            name="numberOfGuest"
                            type="number"
                            value={formData.numberOfGuest}
                            onChange={handleInputChange}
                            error={errors.numberOfGuest}
                        />
                        <InputField
                            label="Description"
                            name="shortDescription"
                            type="textarea"
                            value={formData.shortDescription}
                            onChange={handleInputChange}
                            error={errors.shortDescription}
                            helperText="Include keywords here that users may use to search for suitable venues"
                        />
                    </FormControl>
                    <Button mt={4} colorScheme="teal" onClick={() => {
                        const validationError = validateForm();
                        if (!validationError) {
                            onSubmit({ ...formData });
                        }
                    }}>
                        {mode === "editEvent" ? "Save Changes" : "Create Event"}
                    </Button>
                </Box>
        </Box>
    )
}