
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FormControl, FormLabel, Button, RadioGroup, Radio, Stack, FormErrorMessage } from "@chakra-ui/react";
import InputField from "@/components/InputField";
import { getUsers, saveUser, checkDuplicate } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/api";

// Sign up works but needs to be cleaned heavily
// Needs to be encryted

export default function Signup() {
    const [profileData, setProfileData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const router = useRouter();
    const { login } = useAuth(); // Get the login function from the AuthContext

    // Fetch profiles on component mount
    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const data = await userService.getAllUsers();
            setProfileData(data);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.createUser(profileData);
            setProfileData({ userName: "", firstName: "", lastName: "", email: "", password: "", role: "" });
            fetchProfiles();
        } catch (error) {
            console.error("Error creating profile:", error);
        }
    };

    //this dynamically displays password strength in helper text
    /*const getPasswordStrength = (password: string): "weak" | "strong" | "" => {
        if (password.length >= 6) return "strong";
        if (password.length > 0) return "weak";
        return "";
    };

    //this is just for reactive password strength indicator and error tracking
    */
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

        //if (name === "password") {
        //    getPasswordStrength(value)
        //}
    };


    //this is is to be run on submit and checks validity of form data and returns an object with error messages for any invalid fields
    /*const validateDetails = () => {
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
    */


    return (
        <div className="h-200 flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="w-250">
                <InputField
                    label="User Name"
                    name="userName"
                    value={profileData.userName}
                    onChange={handleInputChange}
                />
                <InputField
                    label="First Name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                />
                <InputField
                    label="Last Name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                />

                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    helperText="We'll never share your email."
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={profileData.password}
                    onChange={handleInputChange}
                //helperText={`Strength: ${getPasswordStrength(profileData.password)}`}
                />
                <FormControl>
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
                </FormControl>
                <Button mt={4} colorScheme='teal' type='submit'>
                    Submit
                </Button>
            </form>
        </div>
    );
}