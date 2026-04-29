import React from "react";
import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from "@chakra-ui/react";
//helper component to streamline form input fields
type InputFieldProps = {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    helperText?: string;
};

const InputField = ({ label, name, type = "text", value, onChange, error, helperText }: InputFieldProps) => {
    
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel>{label}</FormLabel>
            <Input type={type} name={name} value={value} onChange={onChange} />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default InputField;