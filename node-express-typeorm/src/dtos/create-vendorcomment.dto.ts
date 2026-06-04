import { IsNotEmpty, IsString } from "class-validator";

export class CreateVendorCommentDTO {
    @IsString()
    comment: string;
}
