import { IsNotEmpty, IsNumber, IsString, IsBoolean, isBoolean } from "class-validator";

export class CreateEventDTO {
    @IsString()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    eventName: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @IsNotEmpty()
    numberOfGuest: number;

    @IsString()
    shortDescription?: string;

    @IsString()
    image?: string;

    @IsBoolean()
    isArchived?: boolean = false;

}
