import React from "react";
import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, Textarea, Select } from "@chakra-ui/react";
//helper component to streamline form input fields
type InputFieldProps = {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    error?: string;
    helperText?: string;
    selectOptions?: string[]; // for select fields
};

const InputField = ({ label, name, type = "text", value, onChange, error, helperText, selectOptions }: InputFieldProps) => {
const isTextArea = type === "textarea";
const isSelect = type === "select";    
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel>{label}</FormLabel>
            {isTextArea ? (
                <Textarea name={name} value={value} onChange={onChange} />
            ) : isSelect ? (
                <Select name={name} value={value} onChange={onChange}>
                    {selectOptions?.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            ) : (
                <Input type={type} name={name} value={value} onChange={onChange} />
            )}
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default InputField;