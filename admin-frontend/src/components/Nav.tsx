import Router from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Nav = () => {
    const { admin, logout } = useAuth();

    return (
        <nav>
            <ul className="flex space-x-4">
                <li>
                    <Link href={`/featuredEvents/${admin?.userName}`}>
                        Featured Events
                    </Link>
                </li>
                <li>
                    <Link href={`/adminDashboard/${admin?.userName}`}>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Button size="sm" colorScheme="red" onClick={() => { logout(); Router.push("/"); }}>
                        Logout
                    </Button>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
