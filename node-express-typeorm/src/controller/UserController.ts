import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Event } from "../entity/Event";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private vendorCommentRepository = AppDataSource.getRepository("VendorComment");
  private eventRepository = AppDataSource.getRepository(Event);

  /**
   * Retrieves all users from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all users
   */
  async all(request: Request, response: Response) {
    const users = await this.userRepository.find({
      relations: ["events", "preferredEvents"],
    });
    return response.json(users);
  }

  /**
   * Retrieves a single user by their userName
   * @param request - Express request object containing the user ID in params
   * @param response - Express response object
   * @returns JSON response containing the user if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const userName = request.params.userName;
    const user = await this.userRepository.findOne({
      where: { userName },
      relations: ["events", "preferredEvents"],
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
    } catch (error) {
      return response.status(500).json({ message: "Error updating user", error });
    }
  }

  // Vendor CRUD
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
      where: { user: { userName: user.userName } },
    });

    response.json(VendorEvents);
  }

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
  async findComments(request: Request, response: Response) {
    const vendorUserName = await this.userRepository.findOneBy({
      userName: request.params.UserName,
    });

    if (!vendorUserName) {
      return response.status(404).json({ message: "Vendor user not found" });
    }

    if (vendorUserName.role !== "vendor") {
      return response.status(403).json({ message: "User is not a vendor" });
    }

    const hirerUserName = await this.userRepository.findOneBy({
      userName: request.params.UserName,
    });

    if (!hirerUserName) {
      return response.status(404).json({ message: "Hirer user not found" });
    }

    if (hirerUserName.role !== "hirer") {
      return response.status(403).json({ message: "User is not a hirer" });
    }

    const comments = await this.vendorCommentRepository.findOne({
      where: { vendorUserName, hirerUserName },
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
    const vendorUserName = await this.userRepository.findOneBy({
      userName: request.params.UserName,
    });

    if (!vendorUserName) {
      return response.status(404).json({ message: "Vendor user not found" });
    }

    if (vendorUserName.role !== "vendor") {
      return response.status(403).json({ message: "User is not a vendor" });
    }

    const hirerUserName = await this.userRepository.findOneBy({
      userName: request.params.UserName,
    });

    if (!hirerUserName) {
      return response.status(404).json({ message: "Hirer user not found" });
    }

    if (hirerUserName.role !== "hirer") {
      return response.status(403).json({ message: "User is not a hirer" });
    }

    const comment = request.body.comment;
    await AppDataSource.getRepository("VendorComment").upsert(
      { vendorUserName, hirerUserName, comment },
      ["vendorUserName", "hirerUserName"]
    );
    return response.json({ message: "Comment set successfully" });
  }

  async deleteUserCommentFromVendor(request: Request, response: Response) {
    const vendorUserName = await this.userRepository.findOneBy({
      userName: request.params.userName,
    });

    if (!vendorUserName) {
      return response.status(404).json({ message: "Vendor user not found" });
    }

    if (vendorUserName.role !== "vendor") {
      return response.status(403).json({ message: "User is not a vendor" });
    }

    const hirerUserName = await this.userRepository.findOneBy({
      userName: request.params.UserName,
    });

    if (!hirerUserName) {
      return response.status(404).json({ message: "Hirer user not found" });
    }

    if (hirerUserName.role !== "hirer") {
      return response.status(403).json({ message: "User is not a hirer" });
    }

    const commentToDelete = await this.vendorCommentRepository.findOne({
      where: { vendorUserName, hirerUserName },
    });

    if (!commentToDelete) {
      return response.status(404).json({ message: "Comment not found" });
    }

    await this.vendorCommentRepository.remove(commentToDelete);
    return response.json({ message: "Comment deleted successfully" });
  }

  async getAllPreferredEvents(req: Request, res: Response) {
    const user = await this.userRepository.findOneBy({
      userName: req.params.userName,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const preferredEvents = await this.eventRepository.find({
      where: { preferredUsers: { userName: user.userName } },
    });

    res.json(preferredEvents);
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

  // Loads to long (broken)
  async removePreferredEvent(req: Request, res: Response) {
    const user = await this.userRepository.findOneBy({
      userName: req.params.userName,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "hirer") {
      return res.status(403).json({ message: "Only hirers can remove preferred events" });
    }

    const preferredevent = await this.eventRepository.findOne({
      where: { eventId: parseInt(req.params.eventId) },
      relations: ["preferredUsers"],
    });

    if (!preferredevent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (preferredevent.preferredUsers) {
      preferredevent.preferredUsers = preferredevent.preferredUsers.filter((preferredUser) =>
        preferredUser.userName !== user.userName
      );
    }

    try {
      await this.eventRepository.save(preferredevent);
    } catch (error) {
      return res.status(500).json({ message: "Error removing preferred event", error });
    }
  }
};