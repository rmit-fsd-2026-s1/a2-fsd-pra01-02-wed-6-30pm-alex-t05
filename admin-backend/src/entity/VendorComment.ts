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
export class VendorComment {
    @PrimaryColumn()
    vendorUserName: string;

    @PrimaryColumn()
    hirerUserName: string;

    @Column()
    comment: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "vendorUserName", referencedColumnName: "userName" })
    vendor: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: "hirerUserName", referencedColumnName: "userName" })
    hirer: User;
}