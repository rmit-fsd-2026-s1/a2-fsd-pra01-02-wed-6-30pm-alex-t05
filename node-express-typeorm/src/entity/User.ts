import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Event } from "./Event";
import { PreferredVenues } from "./PreferredVenues";

@Entity()
export class User {
  @PrimaryColumn({ unique: true, update: false })
  userName: string; //unique identifier for the user
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ update: false, unique: true })
  email: string;
  @Column()
  password: string;
  @Column()
  role: string; //e.g., "hirer", "vendor"
  @Column({ nullable: true })
  phoneNumber?: string; //optional phone number field'
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  /*
  @Column({ array: true, nullable: true })
  eventRankings?: number[]
  */
  @OneToMany(() => Event, (event: Event) => event.user)
  events: Event[];

  @OneToMany(() => PreferredVenues, (preferredVenue: PreferredVenues) => preferredVenue.user)
  preferredVenues: PreferredVenues[];
}
