import { Box } from "@chakra-ui/react";
import { Event } from "@/types/event";
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
                </Box>
        </Box>
    )
}