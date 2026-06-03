import { IsNotEmpty, IsString } from "class-validator";

export class CreateVendorCommentDTO {
    @IsString()
    @IsNotEmpty()
    comment: string;
}
