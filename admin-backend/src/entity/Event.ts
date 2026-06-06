import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    OneToMany
} from "typeorm";
import { User } from "./User";
import { PreferredEvents } from "./PreferredEvents";
@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    eventId: number;
    @Column()
    eventName: string;
    @Column()
    numberOfGuest: number;
    @Column({ nullable: true })
    address: string;
    @Column({ nullable: true })
    shortDescription?: string;
    @Column({ nullable: true })
    image?: string; // Optional field for event image URL
    @Column({ default: false })
    isBlocked: boolean; // Optional field for vendors to block the events. FOR CREDIT.

    @ManyToOne(() => User, (user) => user.events, {
        lazy: true,
    })
    user: User;

    @OneToMany(() => PreferredEvents, (preferredEvent: PreferredEvents) => preferredEvent.event)
    preferredEvents: PreferredEvents[];
}