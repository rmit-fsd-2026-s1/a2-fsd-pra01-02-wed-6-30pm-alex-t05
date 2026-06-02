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

  //need to do update for vendor
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
    const vendorUserName = request.params.vendorUserName;
    const hirerUserName = request.params.hirerUserName;

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
    const vendorUserName = request.params.vendorUserName;
    const hirerUserName = request.params.hirerUserName;
    const comment = request.body.comment;
    await AppDataSource.getRepository("VendorComment").upsert(
      { vendorUserName, hirerUserName, comment },
      ["vendorUserName", "hirerUserName"]
    );
    return response.json({ message: "Comment set successfully" });
  }

  async deleteUserCommentFromVendor(request: Request, response: Response) {
    const vendorUserName = request.params.vendorUserName;
    const hirerUserName = request.params.hirerUserName;

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
    /** Retrieve the user from the database */
    const user = await this.userRepository.findOneBy({
      userName: req.params.userName,
    });

    /** Check if the user exists, if not, return a 404 error */
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /** Retrieve all preferred events associated with the user from the database */
    const preferredEvents = await this.eventRepository.find({
      where: { preferredUsers: { userName: user.userName } },
    });

    /** Return the preferred events */
    res.json(preferredEvents);
  }

  async removePreferredEvent(req: Request, res: Response) {
  }
};