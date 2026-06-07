import { eventService } from "@/services/api";
import { Box, CheckboxGroup, Checkbox, Stack, Wrap } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function TagSelector({eventId, value, onChange}: {
    eventId?: number,
    value: string[],
    onChange: (tags: string[]) => void,
}) {

    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>(value);

    const handleTagChange = (values: string[]) => {
        setSelectedTags(values);
        onChange(values);
    };

    useEffect(() => {
        async function fetchTags() {
        const tags = await eventService.getAllTags();
        console.log("Fetched tags:", tags);
        setTags(tags);
    } 
        fetchTags();
    }, []);

    useEffect(() => {
        //sets default if editing event
        if (!eventId) return;
        async function fetchTagsForEvent() {
            if (eventId) {
                const eventTags = await eventService.getTagsForEvent(eventId);
                setSelectedTags(eventTags);
            }
        }
        fetchTagsForEvent();
    }, [eventId]);
    return (
        <Box>
            <CheckboxGroup value={selectedTags} onChange={handleTagChange}>
                <Wrap spacing={2}>
                {tags.map(tag => (
                    <Checkbox
                        key={tag}
                        value={tag}
                        mb={2}
                    >
                        {tag}
                    </Checkbox>
                ))}
                </Wrap>
            </CheckboxGroup>
        </Box>
    );
}