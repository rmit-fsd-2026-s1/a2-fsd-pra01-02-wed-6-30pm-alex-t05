
import React, { useState, useEffect } from 'react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { User } from '@/types/user';

export default function Signin() {
    const [email, setEmail] = useState(""); //intial state is empty
    const [password, setPassword] = useState(""); //intial state is empty
    const [error, setError] = useState("") //intial state is empty. also making it false since it has no value in it
    const router = useRouter();
    const { login, users } = useAuth();


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // When the submit button get pressed this executes
        e.preventDefault(); // Page doesn't reload?
        const user = users.find((user: User) => user.email === email && user.password === password);

        if (user) {
            login({
                ...user,
                userName: user.userName,
                email: user.email,
                role: user.role
            });
            console.log("Sign in successful");
            //route to either vendor or hirer dashboard
            router.push(`/${user.role.toLowerCase()}`)
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-100 h-130">
                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                ) : null}
                <form onSubmit={handleSubmit}>
                    <h1 className="!text-4xl">Sign in</h1>
                    <FormControl isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            type='email'
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)} // Sets a new state for 'email'
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type='password'
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)} // Sets a new state for 'password'
                        />
                    </FormControl>

                    <Button mt={4} colorScheme='teal' type='submit'>
                        Sign In
                    </Button>
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