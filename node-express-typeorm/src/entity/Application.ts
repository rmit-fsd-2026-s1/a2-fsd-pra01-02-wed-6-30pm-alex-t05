import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { Event } from "./Event";
import { User } from "./User";

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    applicationId: number;
    @Column()
    status: "pending" | "approved" | "rejected";
    @Column({ type: "float", nullable: true })
    rating: number | null;
    @Column()
    startDate: string;
    @Column()
    endDate: string;

    @ManyToOne(() => User)
    @JoinColumn ({ name: "applicantUserName", referencedColumnName: "userName" })
    user: User;
    @ManyToOne(() => Event)
    @JoinColumn ({ name: "eventId", referencedColumnName: "eventId" })
    event: Event;
}