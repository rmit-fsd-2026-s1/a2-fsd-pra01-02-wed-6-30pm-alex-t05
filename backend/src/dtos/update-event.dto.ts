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
    address: string;

    @IsString()
    shortDescription?: string;

    @IsString()
    image?: string;
}
