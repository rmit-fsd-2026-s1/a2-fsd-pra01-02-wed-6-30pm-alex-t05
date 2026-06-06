import {
    Entity,
    Column,
    PrimaryColumn
} from "typeorm";

@Entity()
export class Admin {
    @PrimaryColumn({ unique: true, update: false })
    userName: string; //unique identifier for the user

    @Column()
    password: string;
}