import { Icon, Avatar } from "@chakra-ui/react"
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { MdEventSeat } from "react-icons/md";
import Nav from "./Nav";

const Header = () => {
    const { admin } = useAuth();
    console.log("Admin in Header:", admin);
    return (
        <div>
            <header className="bg-gray-800 text-white flex">
                <Link href="/" className='p-6'>
                    <h1 className="font-bold flex items-center">
                        <Icon as={MdEventSeat} mr="1" /> Admin (Vendor Venue)
                    </h1>
                </Link>
                <div className="flex space-x-4 items-center ml-auto pr-4">
                    <p className="font-bold pr-2">Hello, {admin?.userName}</p>
                    <Avatar
                        name={admin?.userName}
                        size="sm"
                    />
                </div>
            </header >
            <Nav />
        </div>
    );
};

export default Header;