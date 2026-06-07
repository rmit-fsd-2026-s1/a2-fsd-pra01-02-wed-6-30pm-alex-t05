//This is controlled in UserController 
//as it is too small to warrant its own
import {
    Entity,
    Column,
    JoinColumn,
    PrimaryColumn,
    ManyToMany,
    ManyToOne
} from "typeorm";
import { User } from "./User";
@Entity()
export class ComplianceDocs {
    @PrimaryColumn()
    hirerUserName: string;
    @PrimaryColumn()
    fileName: string;
    @Column()
    fileAsBase64String: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "hirerUserName", referencedColumnName: "userName" })
    hirer: User;
}