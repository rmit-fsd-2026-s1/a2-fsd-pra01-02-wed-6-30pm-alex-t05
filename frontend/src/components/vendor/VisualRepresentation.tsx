import { Box } from "@chakra-ui/react";
import { XAxis, YAxis, Tooltip, Legend, Bar, BarChart } from "recharts";
import { useEvent } from "../../context/EventContext";
export default function VisualRepresentation() {
    const { events } = useEvent();

    //displays a bar graph of approvals per user to visually rank them
    const approvedUsers : { userName: string, value: number }[] = [];
    for (const event of events) {
        for (const application of event.applications) {
            if (application.status === "approved") {
                if (approvedUsers.length > 0) {
                    for (const user of approvedUsers) {
                        if (user.userName === application.applicantUserName) {
                            user.value += 1;
                            break;
                        } else {
                            approvedUsers.push({ userName: application.applicantUserName, value: 1 });
                            break;
                        }
                    }
                } else {
                    approvedUsers.push({ userName: application.applicantUserName, value: 1 });
                }
            }
        }
    }
    //displays a bar graph of rejections per user to visually rank them
    const rejectedUsers : { userName: string, value: number }[] = [];
    for (const event of events) {
        for (const application of event.applications) {
            if (application.status === "rejected") {
                if (rejectedUsers.length > 0) {
                    for (const user of rejectedUsers) {
                        if (user.userName === application.applicantUserName) {
                            user.value += 1;
                            break;
                        } else {
                            rejectedUsers.push({ userName: application.applicantUserName, value: 1 });
                            break;
                        }
                    }
                } else {
                    rejectedUsers.push({ userName: application.applicantUserName, value: 1 });
                }
            }
        }
    }
    return (
        <Box>
            <h1 className="!text-2xl flex items-center justify-center">Visualisations</h1>
            <Box>
                <Box as="h1" textAlign="left" p={5} >Most Accepted Users</Box>
                <BarChart width={400} height={200} data={approvedUsers}>
                    <XAxis dataKey="userName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Accepted" fill="green"/>
                </BarChart>
            </Box>
            <Box>
                <Box as="h1" textAlign="left" p={5} >Most Rejected Users</Box>
                <BarChart width={400} height={200} data={rejectedUsers} >
                    <XAxis dataKey="userName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Rejected" fill="darkred"/>
                </BarChart>
            </Box>
        </Box>  
    );
}
