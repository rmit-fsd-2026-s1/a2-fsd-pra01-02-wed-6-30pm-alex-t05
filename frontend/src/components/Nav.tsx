import Router from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@chakra-ui/react";

const Nav = () => {
    const { user, logout } = useAuth();
    return (
        <nav>
            <ul className="flex space-x-4">
                {user ? (
                    <>
                        <li>
                            <Link href={user.role === "hirer" ? `/hirer/${user.userName}` : `/vendor/${user.userName}`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
                            </Link>
                        </li>
                        {user.role === "hirer" && ( // Only show preferred events link if the user is a hirer
                            <li>
                                <Link href="/preferredEvent">
                                    Preferred Events
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link href="/profile">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Button size="sm" colorScheme="red" onClick={() => { logout(); Router.push("/signin"); }}>
                                Logout
                            </Button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link href="/signin">Sign In/Sign Up</Link>
                        </li>
                    </>

                )}
            </ul>
        </nav>
    );
};

export default Nav;
