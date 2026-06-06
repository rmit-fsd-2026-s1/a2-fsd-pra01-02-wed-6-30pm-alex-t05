import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Event } from "../entity/Event";
import { PreferredEvents } from "../entity/PreferredEvents";
import { VendorComment } from "../entity/VendorComment";
import * as argon2 from "argon2";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private vendorCommentRepository = AppDataSource.getRepository(VendorComment);
  private eventRepository = AppDataSource.getRepository(Event);
  private preferredEventRepository = AppDataSource.getRepository(PreferredEvents);

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async all(request: Request, response: Response) {
    const users = await this.userRepository.find({
      relations: ["events"],
    });
    return response.json(users);
  }

  /**
   * Retrieves a single user by their userName
   * @param request - Express request object containing the userName in params
   * @param response - Express response object
   * @returns JSON response containing the user if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const userName = request.params.userName;
    const user = await this.userRepository.findOne({
      where: { userName },
      relations: ["events"],
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    return response.json(user);
  }
  /**
   * Creates a new user in the database
   * @param request - Express request object containing user details in body
   * @param response - Express response object
   * @returns JSON response containing the created user or error message
   */
  async create(request: Request, response: Response) {
    // Hashes the password before creating the user
    const hashedPassword = await argon2.hash(request.body.password);

    // users password gets replace with the argon2 encryption
    request.body.password = hashedPassword;
    const user = this.userRepository.create(request.body);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      return response.status(500).json({ message: "Error saving user", error });
    }

    response.status(201).json(user);
  }

  /**
   * Deletes a user from the database by their userName
   * @param request - Express request object containing the user userName in params
   * @param response - Express response object
   * @returns JSON response with success message or 404 error if user not found
   */
  async remove(request: Request, response: Response) {
    const userName = request.params.userName;
    const userToRemove = await this.userRepository.findOne({
      where: { userName },
    });

    if (!userToRemove) {
      return response.status(404).json({ message: "User not found" });
    }

    await this.userRepository.remove(userToRemove);
    return response.json({ message: "User removed successfully" });
  }

  /**
   * Updates an existing user's information
   * @param request - Express request object containing user ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated user or error message
   */
  async update(request: Request, response: Response) {
    let user = await this.userRepository.findOneBy({
      userName: request.params.userName,
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    this.userRepository.merge(user, request.body);

    try {
      await this.userRepository.save(user);
      return response.json(user);
    } catch (error) {
      return response.status(500).json({ message: "Error updating user", error });
    }
  }

  /**
 * Log in a user by veriying their email and password
 * @param request - Express request object containing email and password in body
 * @param response - Express response object
 * @returns JSON response containing details of logged in user
 */
  async login(request: Request, response: Response) {
    console.log("Login request received with body:", request.body); // Debug log to check incoming request body
    // Gets users email
    const email = request.body.email;
    // finds the user from database based on the email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    // if users provided the wrong email
    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    // Gets users password
    const password = request.body.password;
    // Compares the password and the password from database with argon2
    const isPasswordValid = await argon2.verify(user.password, password);

    // if users password is wrong
    if (!isPasswordValid) {
      return response.status(401).json({ message: "Invalid password" });
    }

    return response.json(user);
  }

  // Vendor CRUD
  /**
   * Retrieves all events for a specific vendor
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all events for the vendor
   */
  async getAllEventsForVendor(request: Request, response: Response) {
    const user = await this.userRepository.findOneBy({
      userName: request.params.userName, 
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    if (user.role !== "vendor") {
      return response.status(403).json({ message: "User is not a vendor" });
    }

    const VendorEvents = await this.eventRepository.find({
      where: { user: { userName: user.userName }, isArchived: false },
    });

    response.json(VendorEvents);
  }

  /**
 * Retrieves one events for a specific vendor
 * @param request - Express request object containing the userName and event ID in params
 * @param response - Express response object
 * @returns JSON response containing one events for the vendor
 */
  async getOneEventForVendor(request: Request, response: Response) {
    const user = await this.userRepository.findOneBy({
      userName: request.params.userName,
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    if (user.role !== "vendor") {
      return response.status(403).json({ message: "User is not a vendor" });
    }

    const event = await this.eventRepository.findOne({
      where: {
        eventId: parseInt(request.params.eventId),
        user: { userName: user.userName }
      },
    });

    if (!event) {
      return response.status(404).json({ message: "Event not found for this vendor" });
    }

    response.json(event);
  }

  /**
* Creates a new event in the database
* @param request - Express request object containing details of the event and userName of the vendor
* @param response - Express response object
* @returns JSON response containing the created event
*/
  async createEventforVendor(request: Request, response: Response) {
    const user = await this.userRepository.findOneBy({
      userName: request.params.userName,
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    if (user.role !== "vendor") {
      return response.status(403).json({ message: "User is not a vendor" });
    }

    const event = this.eventRepository.create({
      ...request.body,
      user: [user],
    });

    try {
      await this.eventRepository.save(event);
    } catch (error) {
      return response.status(500).json({ message: "Error saving event", error });
    }
  }

  /**
* Updates an event in the database
* @param request - Express request object containing new details of the event and userName of the vendor
* @param response - Express response object
* @returns JSON response containing the updated event
*/
  async updateEventforVendor(request: Request, response: Response) {
    const user = await this.userRepository.findOneBy({
      userName: request.params.userName,
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    if (user.role !== "vendor") {
      return response.status(403).json({ message: "User is not a vendor" });
    }

    let event = await this.eventRepository.findOneBy({
      eventId: parseInt(request.params.eventId),
      user: { userName: user.userName }
    });

    if (!event) {
      return response.status(404).json({ message: "Event not found for this vendor" });
    }

    this.eventRepository.merge(event, request.body);

    try {
      await this.eventRepository.save(event);
    } catch (error) {
      return response.status(500).json({ message: "Error updating event", error });
    }
  }

  /**
* Removes an event from the database
* @param request - Express request object containing the userName and event ID in params
* @param response - Express response object
* @returns JSON response indicating success or failure
*/
  async removeEventforVendor(request: Request, response: Response) {
    const user = await this.userRepository.findOneBy({
      userName: request.params.userName,
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    if (user.role !== "vendor") {
      return response.status(403).json({ message: "User is not a vendor" });
    }

    const result = await this.eventRepository.delete({
      eventId: parseInt(request.params.eventId),
      user: { userName: user.userName }
    });

    if (!result.affected) {
      return response.status(404).json({ message: "Event not found for this vendor" });
    }

    response.json(204).send();
  }

  // Set comment
  async validateUserRoles(vendorUserName: string, hirerUserName: string): Promise<{ success: boolean; message: string; status: number }> {
    const vendor = await this.userRepository.findOneBy({
      userName: vendorUserName,
    });
    if (!vendor) {
      return { success: false, message: "Vendor user not found", status: 404 };
    }

    if (vendor.role !== "vendor") {
      return { success: false, message: "User is not a vendor", status: 403 };
    }
    const hirer = await this.userRepository.findOneBy({
      userName: hirerUserName,
    });
    if (!hirer) {
      return { success: false, message: "Hirer user not found", status: 404 };
    }

    if (hirer.role !== "hirer") {
      return { success: false, message: "User is not a hirer", status: 403 };
    }
    return { success: true, message: "Validation successful", status: 200 };
  }

  async findComments(request: Request, response: Response) {
    const validate = await this.validateUserRoles(request.params.vendorUserName, request.params.hirerUserName);
    if (!validate.success) {
      return response.status(validate.status).json({ message: validate.message });
    }

    const comments = await this.vendorCommentRepository.findOne({
      where: { vendorUserName: request.params.vendorUserName, hirerUserName: request.params.hirerUserName },
    });

    if (!comments) {
      return response.status(404).json({ message: "Comments not found" });
    }
    return response.json(comments);
  }

  async setUserCommentFromVendor(request: Request, response: Response) {
    //Reference: AI suggestion
    //I wanted to set if no comment or update if comment already exists
    //it suggested upsert
    const validate = await this.validateUserRoles(request.params.vendorUserName, request.params.hirerUserName);
    if (!validate.success) {
      return response.status(validate.status).json({ message: validate.message });
    }

    const comment = request.body.comment;
    await AppDataSource.getRepository("VendorComment").upsert(
      { vendorUserName: request.params.vendorUserName, hirerUserName: request.params.hirerUserName, comment },
      ["vendorUserName", "hirerUserName"]
    );
    return response.json({ message: "Comment set successfully" });
  }

  async deleteUserCommentFromVendor(request: Request, response: Response) {
    const validate = await this.validateUserRoles(request.params.vendorUserName, request.params.hirerUserName);
    if (!validate.success) {
      return response.status(validate.status).json({ message: validate.message });
    }

    const commentToDelete = await this.vendorCommentRepository.findOne({
      where: { vendorUserName: request.params.vendorUserName, hirerUserName: request.params.hirerUserName },
    });

    if (!commentToDelete) {
      return response.status(404).json({ message: "Comment not found" });
    }

    await this.vendorCommentRepository.remove(commentToDelete);
    return response.json({ message: "Comment deleted successfully" });
  }

  // ---Preferred Events---
  async getAllPreferredEventsForUser(request: Request, response: Response) {
    const user = await this.userRepository.findOneBy({
      userName: request.params.userName,
    });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    if (user.role !== "hirer") {
      return response.status(403).json({ message: "User is not a hirer" });
    }

    const preferredEvents = await this.preferredEventRepository.find({
      where: { user: { userName: user.userName } },
      order: { ranking: "ASC" },
      relations: ["event"],
    });

    response.json(preferredEvents);
  }

  /**
* Adds a preferred event to the database for a hirer
* @param request - Express request object containing the userName and event ID in params
* @param response - Express response object
* @returns JSON response containing the created preferred event or an error
*/
  async addPreferredEvent(request: Request, response: Response) {
    // Gets the user by their username
    const user = await this.userRepository.findOneBy({
      userName: request.params.userName,
    });

    // Checks if user exists
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // Checks if user is a hirer
    if (user.role !== "hirer") {
      return response.status(403).json({ message: "User is not a hirer" });
    }

    // Gets the event by its id
    const event = await this.eventRepository.findOneBy({
      eventId: parseInt(request.params.eventId),
    });

    // Checks if event exists
    if (!event) {
      return response.status(404).json({ message: "Event not found" });
    }

    // Checks if the preferred event exists with the user
    const existingPreferredEvent = await this.preferredEventRepository.findOneBy({
      user: { userName: user.userName },
      event: { eventId: event.eventId }
    });

    //return nothing if preferred event was found in the list
    if (existingPreferredEvent) {
      return;
    }

    // This get the maximum ranking number 
    const maximum = await this.preferredEventRepository.maximum(
      "ranking", { user: { userName: user.userName } },
    );

    // Creates a new preferred event
    const preferredEvent = this.preferredEventRepository.create({
      user: user,
      event: event,
      ranking: maximum ? + 1 : 1, // If the user has no preferred events, the newly added event will be ranked 1. If the user has events, it will +1 from the higest ranking number
    });

    try {
      // Saves the preferred event to the database
      await this.preferredEventRepository.save(preferredEvent);
    } catch (error) {
      return response.status(500).json({ message: "Error saving preferred event", error });
    }

    response.status(201).json(preferredEvent);
  }

  /**
* Removes an preferred event from the database
* @param request - Express request object containing the userName and event ID in params
* @param response - Express response object
* @returns JSON response indicating success or failure
*/
  async removePreferredEvent(request: Request, response: Response) {
    // Gets the user by their username
    const user = await this.userRepository.findOneBy({
      userName: request.params.userName,
    });

    // Checks if user exists
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // Checks if user is a hirer
    if (user.role !== "hirer") {
      return response.status(403).json({ message: "User is not a hirer" });
    }

    // Deletes the preferred event based on the user and event
    const result = await this.preferredEventRepository.delete({
      user: { userName: user.userName },
      event: { eventId: parseInt(request.params.eventId) }
    });

    // If event was not found
    if (!result.affected) {
      return response.status(404).json({ message: "Preferred event not found for this user and event" });
    }

    response.status(204).send();
  }
};