import React, { useState, useEffect } from 'react';
import { FormControl, FormLabel, Button, Input, Box } from "@chakra-ui/react";
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { User } from "../../types/user";
import { useRouter } from "next/router";
import { useUserRating } from '@/hooks/useUserRating';
import useApplicationHistory from '@/hooks/useApplicationHistory';
import { fileUploader } from '@/services/FileUploader';
import ApplicationHistory from '@/components/ApplicationHistory';
import { userService } from '@/services/api';

export default function Profile() {
    //setup
    const router = useRouter();
    const currentUser = useCurrentUser(); //get the current full user details from the custom hook
    const profileUserName = router.query.userName as string; //get the username from url
    const [profileUser, setProfileUser] = useState<User | null>(null); //state to hold the user details

    const [editing, setEditing] = useState(false); //state to track if the form is in editing mode
    //states for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [validation, setValidation] = useState('')
    const [color, setColor] = useState('')
    
    //toggle for application history display
    const [history, setHistory] = useState(false);
    //gets application history from custom hook
    const applicationHistory = useApplicationHistory(profileUserName);
    //gets rating from custom hook
    const rating = useUserRating(profileUser?.userName || '');
    const credibilityScore = profileUser?.complianceDocuments?.length ?? 0;

    //fetches user to display
    //TODO refactor this to a hook
    useEffect(() => {
        if (!router.isReady) return; //wait for router
        try{
        async function fetchUser() {
            //fetches user details based on url
            const user = await userService.getOneUser(profileUserName);
            setProfileUser(user); //set the profileUser state to the fetched user details
        }
        fetchUser();
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
    }, [profileUserName, currentUser, router.isReady]); //refetches if profile username query parameter or current user changes

    useEffect(() => {
        // When the profileUser state changes, update the form fields with the new user details, also discards unsaved changes when editing
        if (!profileUser) return;
        setFirstName(profileUser.firstName || '');
        setLastName(profileUser.lastName || '');
        setPhoneNumber(profileUser.phoneNumber || '');
    }, [editing, profileUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) {
            setColor(`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded`); // Set color for message
            setValidation('Please fill in all required fields.');
        } else {
            //valid phone number is either empty or a 10 digit number starting with 04
            if (phoneNumber && (phoneNumber.length !== 10 || !phoneNumber.startsWith('04'))) { // Checks if phonenumber is 10 digits if it's not empty
                setValidation('Invalid phone number. Please enter a 10-digit number and starts with "04", or leave blank.');
                setColor(`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded`);
            } else {
                //refactor to use UPDATE query  
                const updatedUser: User = {
                    ...profileUser!, // Spread the existing user data to retain unchanged fields
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    phoneNumber: phoneNumber.trim() || '' // Ensure phone number is a string, even if empty
                };
                const update = await userService.updateUser(updatedUser); // Update user data in database
                if (!update) {
                    setColor(`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded`); // Set color for message
                    setValidation('Error updating profile. Please try again later.');
                    return;
                }
                setColor(`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded`); // Set color for message
                setValidation('Profile updated successfully.'); // Set success message
                setEditing(false); // Exit editing mode
                setProfileUser(updatedUser); // Update the profileUser state with the updated user details
            }
        }
    }
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        //submits file to uploader service
        const file = e.target.files?.[0];
        if (file && profileUser) {
            const result = await fileUploader(profileUser, file);
            if (result.success && result.updatedUser) {
                //runs profile update
                await userService.updateUser(result.updatedUser);
                setProfileUser(result.updatedUser);
            } else {
                setColor(`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded`); // Set color for message
            }
            setValidation(result.message);
        }
    };
    if (!profileUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (

        //page doubles as a public profile page and profile editing page
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
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        variant="flushed" />
                </Box>
                <Box display="grid" gridTemplateColumns="140px 1fr" p={2} gap={4}>
                    <FormLabel htmlFor='lastName'>Last Name</FormLabel>
                    <Input id='lastName'
                        type='text'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        isDisabled={!editing} // Disable input when not in editing mode
                        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        variant="flushed"
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
                        variant="flushed"
                    />
                </Box>
                <Box display="grid" gridTemplateColumns="140px 1fr" p={2} gap={4}>
                    <p>Rating</p>
                    {<p>{rating ? rating : 'Not rated'}</p>}
                </Box>
                <Box display="grid" gridTemplateColumns="140px 1fr" p={2} gap={4}>
                    <p>Credibility Score</p>
                    <p>{credibilityScore ? credibilityScore * 25 + "%" : 'Not rated'}</p>
                </Box>
                <Box>
                    {profileUser.role === "hirer" && editing && (
                        <Box mt={4} display="flex" gap={3}>
                            <p>Compliance Document Upload</p>
                            <Input
                                type="file"
                                accept=".pdf, .png, .jpg, .jpeg"
                                onChange={handleUpload}
                            />
                        </Box>
                    )}
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
                    {profileUser.role === 'hirer' && (
                        <Button mt={4} colorScheme='gray' className="w-full" onClick={() => setHistory(!history)}>
                            {history ? 'Hide Application History' : 'Show Application History'}
                        </Button>
                    )}

                </Box>
                {history && (
                    <Box mt={6}>
                        {applicationHistory.length > 0 ? (
                            <Box>
                                {applicationHistory.map((app) => (
                                    <Box key={app.applicationId} p={2} borderWidth="1px" borderRadius="md" mb={2}>
                                        <ApplicationHistory application={app}/>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <p>No application history available.</p>
                        )}
                    </Box>
                )}
            </FormControl>
        </Box>

    )
}