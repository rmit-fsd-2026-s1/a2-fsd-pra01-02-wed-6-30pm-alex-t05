import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn
} from "typeorm";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    eventId: number;
    @Column()
    eventName: string;
    @Column()
    numberOfGuest: number;
    @Column()
    date: string;
    @Column()
    time: string;
    @Column()
    duration: number;
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
};