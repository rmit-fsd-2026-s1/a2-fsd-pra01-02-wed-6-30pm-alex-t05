import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Event } from "./Event";

@Entity()
export class FeaturedEvents {
    @PrimaryGeneratedColumn()
    FeaturedId: number

    @OneToOne(() => Event)
    @JoinColumn()
    event: Event
}