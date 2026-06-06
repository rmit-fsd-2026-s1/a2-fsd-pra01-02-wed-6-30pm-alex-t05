import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    OneToMany
} from "typeorm";
import { User } from "./User";
import { PreferredVenues } from "./PreferredVenues";
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
    // Removed the owner field since it would be used to build a relationship with the user table.
    //@Column()
    //owner: string;
    @Column({ nullable: true })
    image?: string; // Optional field for event image URL
    /*
    @Column()
    applications: Application[]; // Stores the details of each application, including comments, status, rating, and hire date.
    */
    @Column({ default: false })
    isBlocked: boolean; // Optional field for vendors to block the events. FOR CREDIT.

    @ManyToOne(() => User, (user) => user.events, {
        lazy: true,
    })
    user: User;

    @OneToMany(() => PreferredVenues, (preferredVenue: PreferredVenues) => preferredVenue.event)
    preferredVenues: PreferredVenues[];
}