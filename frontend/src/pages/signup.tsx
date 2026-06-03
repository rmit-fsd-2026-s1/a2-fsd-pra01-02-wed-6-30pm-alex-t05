
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FormControl, FormLabel, Button, RadioGroup, Radio, Stack, FormErrorMessage, Input, Box } from "@chakra-ui/react";
import InputField from "@/components/InputField";
import { getUsers, saveUser, checkDuplicate } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/api";

// Sign up works but needs to be cleaned heavily
// Needs to be encryted

export default function Signup() {
    const [userData, setUserData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    //const [errors, setErrors] = useState<Partial<FormData>>({});
    const [errors, setErrors] = useState("");
    const router = useRouter();
    const { user } = useAuth();

    // Fetch profiles on component mount
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData.userName) {
            setErrors("Username is required");
            return;
        }
        if (!userData.firstName.trim()) {
            setErrors("First name is required");
            return;
        }
        if (!userData.lastName.trim()) {
            setErrors("Last name is required");
            return;
        }
        if (!userData.email) {
            setErrors("Email is required");
            return;
        }
        if (!userData.email.includes("@")) {
            setErrors("Email must be valid e.g. example@email.com");
            return;
        }
        if (user?.email === userData.email && !userData.email) {
            setErrors("Email already exists");
            return;
        }
        if (userData.password.length < 6) {
            setErrors("Password must be at least 6 characters");
            return;
        }
        if (!/[A-Z]/.test(userData.password) || !/[a-z]/.test(userData.password) || !/[!@#$%^&*]/.test(userData.password)) {
            setErrors("Password must contain at least one uppercase letter, one lowercase letter, and one special character (!@#$%^&*)");
            return;
        }
        if (confirmPassword !== userData.password) {
            setErrors("Passwords do not match");
            return;
        }
        if (!userData.role.trim()) {
            setErrors("Select hirer or vendor");
            return;
        }
        try {
            await userService.createUser(userData);
            setUserData({ userName: "", firstName: "", lastName: "", email: "", password: "", role: "" });
            setErrors("");
            router.push("/signin");
        } catch (error) {
            console.error("Error creating user:", error);
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
        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        //if (name === "password") {
        //    getPasswordStrength(value)
        //}
    };

    return (
        <main>
            {errors && (
                <Box mb={4} p={3} bg="red.100" borderRadius="md" color="red.700">
                    {errors}
                </Box>
            )}
            <div className="h-200 flex items-center justify-center bg-gray-100">
                <form onSubmit={handleSubmit} className="w-250">

                    <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input type='userName'
                            value={userData.userName}
                            onChange={(e) => setUserData({ ...userData, userName: e.target.value })} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Input type='firstName'
                            value={userData.firstName}
                            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                            value={userData.lastName}
                            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={userData.password}
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Account Type</FormLabel>
                        <RadioGroup
                            onChange={(value) => setUserData(prev => ({ ...prev, role: value }))}
                            value={userData.role}>
                            <Stack direction='row'>
                                <Radio value='hirer'>Hirer</Radio>
                                <Radio value='vendor'>Vendor</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <Button mt={4} colorScheme='teal' type='submit'>
                        Sign Up
                    </Button>
                </form>
            </div>
        </main>
    );
}