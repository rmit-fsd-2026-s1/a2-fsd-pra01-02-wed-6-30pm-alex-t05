import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Event } from "../entity/Event";
import { User } from "../entity/User";


export class EventController {
  private eventRepository = AppDataSource.getRepository(Event);
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Retrieves all events from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all events
   */
  async all(request: Request, response: Response) {
    const events = await this.eventRepository.find({
      relations: ["preferredUsers"],
    });
    return response.json(events);
  }

  /**
   * Retrieves a single event by its ID
   * @param request - Express request object containing the event ID in params
   * @param response - Express response object
   * @returns JSON response containing the event if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const eventId = parseInt(request.params.id);
    const event = await this.eventRepository.findOne({
      where: { eventId },
      relations: ["preferredUsers"],
    });

    if (!event) {
      return response.status(404).json({ message: "Event not found" });
    }
    return response.json(event);
  }
  /**
   * Creates a new event in the database
   * @param request - Express request object containing event details in body
   * @param response - Express response object
   * @returns JSON response containing the created event or error message
   */
  async create(request: Request, response: Response) {
    const event = this.eventRepository.create(request.body);

    try {
      await this.eventRepository.save(event);
    } catch (error) {
      return response.status(500).json({ message: "Error saving event", error });
    }

    response.status(201).json(event);
  }

  /**
 * Updates an existing event's information
 * @param request - Express request object containing event ID in params and updated details in body
 * @param response - Express response object
 * @returns JSON response containing the updated event or error message
 */

  /**
   * Deletes a user from the database by their userName
   * @param request - Express request object containing the user userName in params
   * @param response - Express response object
   * @returns JSON response with success message or 404 error if user not found
   */
  async remove(request: Request, response: Response) {
    const eventId = parseInt(request.params.id);
    const eventToRemove = await this.eventRepository.findOne({
      where: { eventId },
    });

    if (!eventToRemove) {
      return response.status(404).json({ message: "Event not found" });
    }

    await this.eventRepository.remove(eventToRemove);
    return response.json({ message: "Event removed successfully" });
  }

  async update(request: Request, response: Response) {
    let event = await this.eventRepository.findOneBy({
      eventId: parseInt(request.params.id),
    });

    if (!event) {
      return response.status(404).json({ message: "Event not found" });
    }

    this.eventRepository.merge(event, request.body);

    try {
      await this.eventRepository.save(event);
    } catch (error) {
      return response.status(500).json({ message: "Error updating event", error });
    }

    response.json(event);

    /* const eventId = parseInt(request.params.id);
const { eventName, numberOfGuest, date, time, duration, shortDescription, image, isBlocked } = request.body;

let eventToUpdate = await this.eventRepository.findOne({
  where: { eventId },
});

if (!eventToUpdate) {
  return response.status(404).json({ message: "Event not found" });
}

const updatedEvent: Event = {
  ...eventToUpdate,
  eventName: eventName,
  numberOfGuest: numberOfGuest,
  date: date,
  time: time,
  duration: duration,
  shortDescription: shortDescription,
  image: image,
  isBlocked: isBlocked
};

try {
  await this.eventRepository.save(updatedEvent);
  return response.json(updatedEvent);
} catch (error) {
  return response
    .status(400)
    .json({ message: "Error updating event", error });
}
*/
  }

  /**
 * Retrieves all events for a specific user based on their userName
 */
  async findByUser(request: Request, response: Response) {
    const userName = request.params.userName;
    const events = await this.eventRepository.find({
      where: { user: { userName } },
      relations: ["user"],
    });
    return response.json(events);
  }

  async addPreferredEvents(request: Request, response: Response) {
    const event = await this.eventRepository.findOne({
      where: { eventId: parseInt(request.params.eventId) },
      relations: ["preferredUsers"],
    });

    if (!event) {
      return response.status(404).json({ message: "Event not found" });
    }

    // Find the profile
    const user = await this.userRepository.findOne({
      where: { userName: request.params.userName },
      //relations: ["preferredEvents"],
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    if (user.role !== "hirer") {
      return response.status(403).json({ message: "Only hirers can prefer events" });
    }

    if (!event.preferredUsers) {
      event.preferredUsers = [];
    }

    event.preferredUsers.push(user);

    try {
      await this.eventRepository.save(event);
      response.json({ message: "Event added to preferred events" });
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Error adding event to preferred events", error });
    }
  }
}