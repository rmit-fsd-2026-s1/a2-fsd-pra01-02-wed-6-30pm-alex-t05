import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateApplicationDTO {
    @IsString()
    @IsNotEmpty()
    applicantUserName: string;

    @IsNumber()
    @IsNotEmpty()
    eventId: number;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    startDate: string;

    @IsString()
    @IsNotEmpty()
    endDate: string;
}
