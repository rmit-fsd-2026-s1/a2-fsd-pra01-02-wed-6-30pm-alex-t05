import { FormControl, FormHelperText, FormLabel } from "@chakra-ui/react/form-control";
import { useState } from "react";
import { Input } from "@chakra-ui/react";

export default function FileUploader({
    userName,
    onSubmit,
} : {
    userName: string,
    onSubmit: (fileName: string, fileToSubmit: string) => void,
}) {

    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null); // Clear previous errors
        const file = e.target.files?.[0];
        if (!file) return;
        const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            setError("Invalid file type. Please upload a PDF, PNG, JPG, or JPEG.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError("File size exceeds 5MB limit.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result && typeof reader.result === "string") {
                onSubmit(file.name, reader.result);
            } else {
                setError("Error processing file.");
            }
        };
        reader.onerror = () => setError("Error reading file.");
        reader.readAsDataURL(file);
    };

    return (
        <FormControl>
            <Input type="file" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
            <FormHelperText>Upload a compliance document (PDF, PNG, JPG, JPEG)</FormHelperText>
            {error && <FormHelperText color="red.500">{error}</FormHelperText>}

        </FormControl>

    )
        
}