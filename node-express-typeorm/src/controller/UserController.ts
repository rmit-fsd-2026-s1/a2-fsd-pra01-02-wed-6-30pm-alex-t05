import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private vendorCommentRepository = AppDataSource.getRepository("VendorComment");

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
   * @param request - Express request object containing the user ID in params
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
  async save(request: Request, response: Response) {
    //const { userName, firstName, lastName, email, password, role, phoneNumber } = request.body;
    const user = this.userRepository.create(request.body);


    //const user: User = {
    //  userName: userName,
    //  firstName: firstName,
    //  lastName: lastName,
    //  email: email,
    //  password: password,
    //  role: role,
    //  phoneNumber: phoneNumber
    //};

    try {
      await this.userRepository.save(user);
    } catch (error) {
      return response.status(500).json({ message: "Error saving user", error });
    }
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
    const userName = request.params.userName;
    const { firstName, lastName, email, password, role, phoneNumber } = request.body;

    let userToUpdate = await this.userRepository.findOne({
      where: { userName },
    });

    if (!userToUpdate) {
      return response.status(404).json({ message: "User not found" });
    }

    const updatedUser: User = {
      ...userToUpdate,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      role: role,
      phoneNumber: phoneNumber
    };

    try {
      await this.userRepository.save(updatedUser);
      return response.json(updatedUser);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating user", error });
    }
  }

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
}