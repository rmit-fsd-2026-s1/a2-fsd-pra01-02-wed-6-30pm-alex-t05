import React from "react";
import { Image, Icon } from "@chakra-ui/react"
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { MdEventSeat } from "react-icons/md";


const Header = () => {
    const { user } = useAuth();
    return (
        <header className="bg-gray-800 text-white flex">
            <Link href="/" className='p-6'>
                <h1 className="font-bold flex items-center">
                    <Icon as={MdEventSeat} mr="1" /> Venue Vendors
                </h1>
            </Link>
            <div className="flex space-x-4 items-center ml-auto pr-4">
                <p className="font-bold pr-2">Hello, {user?.userName || 'Guest'}</p>
                <Image
                    //placeholder image 
                    src="https://mockmind-api.uifaces.co/content/human/80.jpg"
                    boxSize="50px"
                    borderRadius="full"
                    fit="cover"
                />
            </div>

        </header >
    );
};

export default Header;