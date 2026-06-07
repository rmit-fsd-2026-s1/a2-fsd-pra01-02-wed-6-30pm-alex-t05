
import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/api";
import axios from 'axios';


export default function Signin() {
    const [email, setEmail] = useState(""); //intial state is empty
    const [password, setPassword] = useState(""); //intial state is empty
    const [error, setError] = useState("") //intial state is empty. also making it false since it has no value in it
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => { // When the submit button get pressed this executes
        e.preventDefault(); // Page doesn't reload?
        setError(""); //clear previous error message on new submit attempt
        console.log("attempting log in")
        if (!validate()) { //if validation fails, stop the submission process
            console.log("validation failed");
            return;
        }
        try {
            await login(email, password);
            router.push("/"); // Redirect to home page after successful login
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) { // Check if the error status is 401 (Unauthorized) or 400 (Bad Request)
                    setError("Invalid email or password"); // Set error message if login fails due to invalid credentials
                }
            } else {
                setError("An error occurred during login. Please try again."); // Set generic error message for other errors
            }
        }
    };

    const validate = () => {
        if (!email) {
            setError("Email is required");
            console.log("validation failed: email is required");
            return false;
        }
        if (!email.includes("@")) {
            console.log("validation failed: email must be valid");
            setError("Email must be valid e.g., example@domain.com");
            return false;
        }
        if (!password) {
            setError("Password is required");
            return false;
        }
        return true;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-100 h-130">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form>
                    <h1 className="!text-4xl">Sign in</h1>
                    <FormControl>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            type='text'
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)} // Sets a new state for 'email'
                        />
                        <FormLabel>Password</FormLabel>
                        <Input
                            type='password'
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)} // Sets a new state for 'password'
                        />


                        <Button mt={4} colorScheme='teal' onClick={handleSubmit} type='submit'>
                            Sign In
                        </Button>
                    </FormControl>
                </form>
            </div>
            <div className="bg-blue-200 p-8 rounded-lg shadow-md w-75 h-130">
                <div>
                    <h1 className="!text-6xl">Register</h1>
                    <h1 className="!text-4xl">An Account</h1>
                </div>
                <Button mt={4} colorScheme='teal' type='button' onClick={() => router.push("/signup")}>
                    Register
                </Button>
            </div>
        </div>
    );
}