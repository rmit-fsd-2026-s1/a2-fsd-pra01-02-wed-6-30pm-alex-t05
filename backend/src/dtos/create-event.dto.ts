import { IsNotEmpty, IsNumber, IsString, IsBoolean } from "class-validator";

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
}
