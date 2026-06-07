//This is controlled in UserController 
//as it is too small to warrant its own
import {
    Entity,
    PrimaryColumn,
} from "typeorm";
@Entity()
export class Tag {
    @PrimaryColumn()
    tag: string;
}