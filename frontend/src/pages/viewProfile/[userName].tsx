import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { userService } from '@/services/api';
import { User } from "@/types/user";
import { Avatar } from "@chakra-ui/react/avatar";

export default function ViewProfile() {
    const router = useRouter();
    const { userName } = router.query;
    const [profileUser, setProfileUser] = useState<User | null>(null);

    useEffect(() => {
        if (userName) {
            fetchUser();
            console.log(profileUser);
        }
    }, [userName]);

    const fetchUser = async () => {
        try {
            const data = await userService.getOneUser(userName as string);
            setProfileUser(data);
            console.log(profileUser);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    return (
        <main>
            <h1 className="!text-2xl flex items-center justify-center">Profile</h1>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="grid grid-cols-3 gap-4 mb-6" style={{ gridTemplateColumns: "1fr 2fr" }}>
                    <section className="bg-white border border-gray-200 rounded-lg p-6">
                        <Avatar
                            name={profileUser?.userName}
                            size="2xl"
                        />
                        <h3 className="font-semibold mb-3 pt-5">Username: {profileUser?.userName}</h3>
                        <ul style={{ listStyleType: "none" }}>
                            <li>First Name: {profileUser?.firstName}</li>
                            <li>Last Name: {profileUser?.lastName}</li>
                            <li>Email: {profileUser?.email}</li>
                            <li>Role: {profileUser?.role}</li>
                            <li>Phone Number: {profileUser?.phoneNumber || "Unknown"}</li>
                            <li>Rating: NEED TO DO</li>
                        </ul>
                    </section>

                    <aside className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold mb-3">Application History</h3>
                        <ul className="text-gray-600 list-disc list-inside leading-loose">
                            <li>Quick links</li>
                            <li>Recent posts</li>
                            <li>Contact info</li>
                        </ul>
                    </aside>
                </div>
            </div>
        </main>
    )
}
//}