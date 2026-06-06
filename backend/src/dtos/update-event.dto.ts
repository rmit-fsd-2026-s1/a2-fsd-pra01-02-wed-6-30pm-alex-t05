import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional } from "class-validator";

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
    @IsOptional()
    isArchived?: boolean = false;

    @IsString()
    shortDescription?: string;

    @IsString()
    image?: string;
}
