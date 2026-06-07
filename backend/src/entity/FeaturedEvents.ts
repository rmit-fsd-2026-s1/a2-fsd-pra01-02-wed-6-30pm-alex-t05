import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Event } from "./Event";

@Entity()
export class FeaturedEvents {
    @PrimaryGeneratedColumn()
    FeaturedId: number

    @OneToOne(() => Event, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn()
    event: Event
}