import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProfileDTO {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    phoneNumber?: string;
}
