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
  userName: string; // Unique identifier for the user
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string; // e.g., "hirer", "vendor"
  phoneNumber?: string; // Optional phone number field
  eventRankings?: number[]
}
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
