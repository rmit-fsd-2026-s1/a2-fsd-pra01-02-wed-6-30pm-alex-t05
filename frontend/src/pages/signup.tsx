//TODO 
// Define password requirements and display in helper text
// Improve password strength indicator (color, progress bar etc)
// Add field for vendor or hirer and route accordingly on submit (radio)
// Add global state for profile data and route to profile page on submit

//implement authentication component shared with signin



import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FormControl, FormLabel, Button, RadioGroup, Radio, Stack, FormErrorMessage } from "@chakra-ui/react";
import InputField from "@/components/InputField";
import { getUsers, saveUser, checkDuplicate } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {

    interface FormData {
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
        role: string;
    };

    const [profileData, setProfileData] = useState<FormData>({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
        });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const router = useRouter();
    const { login } = useAuth(); // Get the login function from the AuthContext

    //this dynamically displays password strength in helper text
    const getPasswordStrength = (password: string): "weak" | "strong" | "" => {
        if (password.length >= 6) return "strong";
        if (password.length > 0) return "weak";
        return "";
    };
        
    //this is just for reactive password strength indicator and error tracking
    const handleInputChange = (
        
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            const { name, value } = e.target;
            setProfileData((prevState) => ({
            ...prevState,
            [name]: value,
            }));
            if (!!errors[name as keyof FormData]) {
                setErrors(prev => ({ ...prev, [name]: undefined }));
            }

            if (name === "password") {
                getPasswordStrength(value)
            }
        };


    
    

    //this is is to be run on submit and checks validity of form data and returns an object with error messages for any invalid fields
    const validateDetails = () => {
        const newErrors: Partial<FormData> = {};
        if (!profileData.userName) {
            newErrors.userName = "Username is required";
        }
        if (!profileData.firstName) {
            newErrors.firstName = "First name is required";
        }
        if (!profileData.lastName) {
            newErrors.lastName = "Last name is required";
        }
        if (!profileData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (profileData.password.length < 6 || !profileData.password) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (profileData.confirmPassword !== profileData.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        if (!profileData.role) {
            newErrors.role = "Account type is required";
        }
        console.log("Validation errors:", newErrors);
   
        return newErrors;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        //validation
        //reset errors
        //setErrors({});
        //validate details and set errors if any
        const newErrors = validateDetails();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        //runs if no errors
        if(checkDuplicate("userName", profileData.userName) || checkDuplicate("email", profileData.email)) {
            const newErrors: Partial<FormData> = {};
            if(checkDuplicate("email", profileData.email)) {
                newErrors.email = "Email already exists";
            }
            if(checkDuplicate("userName", profileData.userName)) {
                newErrors.userName = "Username already exists";
            }
            setErrors(newErrors);
            return;
        }

        const { confirmPassword, ...profileDataToSave } = profileData; // Exclude confirmPassword from the data to be saved
        saveUser(profileDataToSave);

        console.log("Profile data stored in localStorage");
        console.log(getUsers());
        login(profileData);
        router.push(`/${profileData.role.toLowerCase()}`);
        setProfileData({
            userName: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: ''
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>

                <InputField
                    label="User Name"
                    name="userName"
                    value={profileData.userName}
                    onChange={handleInputChange}
                    error={errors.userName}
                />
                <InputField
                    label="First Name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                />
                <InputField
                    label="Last Name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                />
                
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    helperText="We'll never share your email."
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={profileData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    helperText={`Strength: ${getPasswordStrength(profileData.password)}`}
                />
                <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                />
                <FormControl isInvalid={!!errors.role}>
                    <FormLabel>Account Type</FormLabel>
                    <RadioGroup 
                        onChange={(value) => setProfileData(prev => ({ ...prev, role: value }))} 
                        value={profileData.role}
                    >
                        <Stack direction='row'>
                            <Radio value='hirer'>Hirer</Radio>
                            <Radio value='vendor'>Vendor</Radio>
                        </Stack>
                    </RadioGroup>
                    <FormErrorMessage>{errors.role}</FormErrorMessage>
                </FormControl>
                <Button mt={4} colorScheme='teal' type='submit'>
                    Submit
                </Button>
            </form>
        </div>
    );
}