import React, { useState, useEffect } from 'react';
import { FormControl, FormLabel, Button, Input, Box, Flex } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useCurrentUser } from '../hooks/useCurrentUser';
import { updateUser, getUserByUserName } from '../services/userService';
import { User } from "../types/user";
import { useRouter } from "next/router";
import { useUserRating } from '@/hooks/useUserRating';
import ApplicationHistory from '@/components/ApplicationHistory';
import useApplicationHistory from '@/hooks/useApplicationHistory';

//1. Given the hirer is logged in, When the hirer opens the profile page, Then the system
//displays editable fields for name and phone number, and non - editable fields for
//email and password(as these were already registered during sign - up).
//2. Given the hirer updates their name or phone number, When the hirer saves the
//changes, Then the system updates and stores the new profile information and
//displays a confirmation message.
//3. Given the hirer enters invalid data(e.g., empty name or invalid phone number
//format), When the hirer attempts to save, Then the system prevents submission and
//displays a validation error message.
//4. Given the profile has been successfully updated, When the hirer returns to the
//profile page, Then the updated name and phone number are displayed.

//NEED TO FIX
// Errors are still present in setFirstName(user.firstName || '');, setLastName(user.lastName || '');, setPhoneNumber(user.phoneNumber || '');

export default function Profile() {
    const router = useRouter();
    const currentUser = useCurrentUser(); // Get the current full user details from the custom hook
    const refUserName = router.query.ref as string; // Get the ref query parameter from the URL and cast it to a string
    const [profileUser, setProfileUser] = useState<User | null>(null); // State to hold the user details
    const { login } = useAuth(); // Get the login function from the AuthContext 

    const [editing, setEditing] = useState(false); // State to track if the form is in editing mode
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [validation, setValidation] = useState('')
    const [color, setColor] = useState('') 
    const [history, setHistory] = useState(false);
    //gets rating from custom hook
    const rating = useUserRating(profileUser?.userName || '');
    //gets application history from custom hook
    const applicationHistory = useApplicationHistory(profileUser?.userName || '');
    // When the component mounts, check if there's a ref query parameter and fetch the corresponding user details, otherwise defaults to current user
    useEffect(() => { 
        async function fetchUser() {
            if (refUserName) {
                const user = await getUserByUserName(refUserName); // Fetch the user details using the email from the ref query parameter
                setProfileUser(user); // Set the profileUser state to the fetched user details
            } else {
                setProfileUser(currentUser || null); // If no ref query parameter, set profileUser to the current user from the custom hook
            }
        }
        fetchUser();
    }, [refUserName, currentUser, router.isReady]);

    useEffect(() => { 
        // When the profileUser state changes, update the form fields with the new user details, also discards unsaved changes when editing
        if (profileUser) {
            setFirstName(profileUser.firstName || '');
            setLastName(profileUser.lastName || '');
            setPhoneNumber(profileUser.phoneNumber || '');
        }
    }, [profileUser, editing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) {
            setColor(`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded`); // Set color for message
            setValidation('Please fill in all required fields.');
        } else {
            if (phoneNumber.length < 10 || phoneNumber.length > 10 || !phoneNumber.startsWith('04')) { // Checks if phonenumber is 10 digits if it's not empty
                setValidation('Invalid phone number. Please enter a 10-digit number and starts with "04".');
                setColor(`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded`);
            } else {
                const updatedUser: User = {
                    ...profileUser!, // Spread the existing user data to retain unchanged fields
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    phoneNumber: phoneNumber.trim() || '' // Ensure phone number is a string, even if empty
                };
                updateUser(updatedUser); // Update user data in localStorage
                login(updatedUser); // Update user data in AuthContext
                setColor(`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded`); // Set color for message
                setValidation('Profile updated successfully.'); // Set success message
            }
        }
    }

    return (
        profileUser ? (
            <Box p={4} bg="white" rounded="md" shadow="md">
                
                {validation ? (
                    <div className={color}>
                        {validation}
                    </div>
                ) : null}
                <FormControl className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="!text-2xl flex items-center justify-center">Update Profile</h1>
                    <Box display="grid" gridTemplateColumns="140px 1fr" p={2} gap={4} mt={4}>
                        <p>Username</p>
                        <p>{profileUser.userName}</p>
                    </Box>
                    <Box display="grid" gridTemplateColumns="140px 1fr" p={2} gap={4}>
                        <p>Email</p>
                        <p>{profileUser.email}</p>
                    </Box>
                    <Box display="grid" gridTemplateColumns="140px 1fr" p={2} gap={4}>
                    <FormLabel htmlFor='firstName'>First Name</FormLabel>
                    <Input
                        id='firstName'
                        type='text'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        isDisabled={!editing} // Disable input when not in editing mode
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </Box>
                    <Box display="grid" gridTemplateColumns="140px 1fr" p={2} gap={4}>
                    <FormLabel htmlFor='lastName'>Last Name</FormLabel>
                    <Input id='lastName'
                        type='text'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        isDisabled={!editing} // Disable input when not in editing mode
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </Box>
                    <Box display="grid" gridTemplateColumns="140px 1fr" p={2} gap={4}>
                    <FormLabel htmlFor='phoneNumber'>Phone Number</FormLabel>
                    <Input id='phoneNumber'
                        type='tel'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        isDisabled={!editing} // Disable input when not in editing mode
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </Box>
                    <Box display="grid" gridTemplateColumns="140px 1fr" p={2} gap={4}>
                        <p>Rating</p>
                        <p>{rating ? rating : 'Not rated'}</p>
                    </Box>
                    <Box mt={6} display="flex" gap={3}>
                    {profileUser.userName === currentUser?.userName && ( 
                        // Only show the update button if the profile being viewed is the current user's profile
                        //This doubles as a check to prevent users from editing other users' profiles
                        <Button mt={4} colorScheme='teal' type='submit' className="w-full" onClick={() => setEditing(!editing)}>
                            {editing ? 'Cancel' : 'Edit'}
                        </Button>
                    )}
                    {editing && (
                        <Button mt={4} colorScheme='teal' type='submit' className="w-full" onClick={handleSubmit}>
                            Save
                        </Button>
                    )}
                    <Button mt={4} colorScheme='gray' className="w-full" onClick={() => setHistory(!history)}>
                        {history ? 'Hide Application History' : 'Show Application History'}
                    </Button>
                    </Box>
                    {history && (
                    <Box mt={6}>
                        <p> Application History:</p>
                        <Box as="ul" mt={2}>
                            {applicationHistory.map((application) => {
                                return (
                                    <ApplicationHistory
                                        key={application.id}
                                        application={application}
                                    />
                                );
                            })}
                        </Box>                    
                    </Box>
                    )}
                </FormControl>
                
            
            </Box>
        ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">User not found</p>
            </div>
        )
    )
}