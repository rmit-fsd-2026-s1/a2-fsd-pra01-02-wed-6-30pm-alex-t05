import { Image } from "@chakra-ui/react";


interface CardProps {
    eventID: number;
    eventName: string;
    numberOfGuest: number;
    address?: string;
    image?: string;
    isBlocked: boolean;
    shortDescription?: string;
}

export default function indexCard({ eventID, eventName, numberOfGuest, address, image, shortDescription }: CardProps) {
    return (
        <div className="flex justify-center">
            <div className="rounded-lg p-5 w-200" key={eventID}>
                <Image src={image} alt={eventName} className="w-full h-20 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">{eventName}</h2>
                <div className="grid grid-cols-2">
                    <p className="text-gray-500">Guest: {numberOfGuest}</p>
                    <p className="text-gray-500">Address: {address || "No address provided"}</p>
                </div>
                <p className="text-gray-500 mt-2">
                    Description: {shortDescription}
                </p>
            </div>
        </div>
    );
}
