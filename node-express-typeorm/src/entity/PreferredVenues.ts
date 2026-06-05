import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { User } from "./User";
import { Event } from "./Event";

@Entity()
export class PreferredVenues {
    @PrimaryGeneratedColumn()
    preferredVenueId: number

    @ManyToOne(() => User, (user: User) => user.preferredVenues)
    user: User;

    @ManyToOne(() => Event, (event: Event) => event.preferredVenues)
    event: Event;

    @Column()
    ranking: number;
}