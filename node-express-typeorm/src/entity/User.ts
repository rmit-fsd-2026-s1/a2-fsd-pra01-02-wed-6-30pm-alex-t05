import { read } from "fs";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn
} from "typeorm";

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
  /*
  @Column({ array: true, nullable: true })
  eventRankings?: number[]
  */
}
/*
@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  age: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
*/