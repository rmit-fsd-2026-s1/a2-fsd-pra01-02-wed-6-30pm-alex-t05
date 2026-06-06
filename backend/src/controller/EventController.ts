import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Event } from "../entity/Event";
import { User } from "../entity/User";
import { Application } from "../entity/Application";


export class EventController {
  private eventRepository = AppDataSource.getRepository(Event);
  private userRepository = AppDataSource.getRepository(User);
  private applicationRepository = AppDataSource.getRepository(Application);

  /**
   * Retrieves all events from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all events
   */
  async all(request: Request, response: Response) {
    const events = await this.eventRepository.find( { where: { isArchived: false } });
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
      where: { eventId, isArchived: false },
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
    console.log("Creating event with data:", request.body);
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
    console.log("Attempting to remove event:", eventToRemove);

    if (!eventToRemove) {
      return response.status(404).json({ message: "Event not found" });
    }
    const applicationCount = await this.applicationRepository.count({ where: { event: { eventId } } });
    if (applicationCount > 0) {
      // If there are applications associated with the event, set isArchived to true instead of deleting
      eventToRemove.isArchived = true;
      try {
        console.log("Archiving event with ID:", request.params.id);
        await this.eventRepository.save(eventToRemove);
        console.log("Event archived successfully:", eventToRemove);
        return response.json({ message: "Event archived successfully" });
      } catch (error) {
        return response.status(500).json({ message: "Error archiving event", error });
      }
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
const { eventName, numberOfGuest, address, shortDescription, image, isBlocked } = request.body;

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
  address: address,
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
      where: { user: { userName }, isArchived: false },
      relations: ["user"],
    });
    return response.json(events);
  }
}