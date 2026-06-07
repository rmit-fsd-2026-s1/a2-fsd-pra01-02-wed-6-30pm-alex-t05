//This is controlled in EventController 
//as it is too small to warrant its own
import {
    Entity,
    JoinColumn,
    PrimaryColumn,
    ManyToOne
} from "typeorm";
import { Event } from "./Event";
import { Tag } from "./Tag";
@Entity()
export class EventTags {
  @PrimaryColumn()
  eventId: number;

  @PrimaryColumn()
  tag: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: "eventId", referencedColumnName: "eventId" })
  event: Event;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: "tag", referencedColumnName: "tag" })
  tagEntity: Tag;
}