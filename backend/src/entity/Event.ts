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
    isBlocked: boolean; //set by admin to block an event from being applied to, without deleting it
    @Column({ default: false })
    isArchived: boolean; //set if an event with an application history is deleted, to be set instead to maintain history 

    @ManyToOne(() => User, (user) => user.events, {
        lazy: true,
    })
    user: User;

    @OneToMany(() => PreferredEvents, (preferredEvent: PreferredEvents) => preferredEvent.event)
    preferredEvents: PreferredEvents[];
}