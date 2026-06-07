import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Event } from "./Event";

@Entity()
export class PreferredEvents {
    @PrimaryGeneratedColumn()
    preferredEventId: number

    @ManyToOne(() => User, (user: User) => user.preferredEvents)
    user: User;

    @ManyToOne(() => Event, (event: Event) => event.preferredEvents, { cascade: true, onDelete: "CASCADE" })
    event: Event;

    @Column()
    ranking: number;
}