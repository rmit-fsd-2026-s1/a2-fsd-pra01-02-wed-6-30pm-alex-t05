import { Icon, Avatar } from "@chakra-ui/react"
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
                <Avatar
                    name={user?.userName || 'Guest'}
                    size="sm"
                />
            </div>

        </header >
    );
};

export default Header;