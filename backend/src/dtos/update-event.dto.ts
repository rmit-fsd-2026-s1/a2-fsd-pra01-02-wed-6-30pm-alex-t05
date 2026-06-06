import { IsNotEmpty, IsNumber, IsString, IsBoolean } from "class-validator";

export class UpdateEventDTO {
    @IsString()
    @IsNotEmpty()
    eventName: string;

    @IsNumber()
    @IsNotEmpty()
    numberOfGuest: number;

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsString()
    @IsNotEmpty()
    duration: number;

    @IsString()
    shortDescription?: string;

    @IsString()
    image?: string;

    // Unsure of this one
    @IsBoolean()
    isBlocked: boolean;
}
