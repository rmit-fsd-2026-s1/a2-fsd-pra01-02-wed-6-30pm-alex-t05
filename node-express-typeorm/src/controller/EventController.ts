import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Event } from "../entity/Event";

export class EventController {
  private eventRepository = AppDataSource.getRepository(Event);

  /**
   * Retrieves all events from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all events
   */
  async all(request: Request, response: Response) {
    const events = await this.eventRepository.find();

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
  async save(request: Request, response: Response) {
    const { eventName, numberOfGuest, date, time, duration, shortDescription, image, isBlocked } = request.body;

    const event = Object.assign(new Event(), {
      eventName,
      numberOfGuest,
      date,
      time,
      duration,
      shortDescription,
      image,
      isBlocked
    });

    try {
      const savedEvent = await this.eventRepository.save(event);
      return response.status(201).json(savedEvent);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error creating event", error });
    };
  }

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

  /**
   * Updates an existing event's information
   * @param request - Express request object containing event ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated event or error message
   */
  async update(request: Request, response: Response) {
    const eventId = parseInt(request.params.id);
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
};