import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Application } from "../entity/Application";

export class ApplicationController {
  private applicationRepository = AppDataSource.getRepository(Application);

  /**
   * Retrieves all applications from the database
   * @param request - Express request object
   * @param response - Express response object
   * @returns JSON response containing an array of all applications
   */
  async all(request: Request, response: Response) {
    const applications = await this.applicationRepository.find();
    
    return response.json(applications);
  }

  /**
   * Retrieves a single application by its id
   * @param request - Express request object containing the application ID in params
   * @param response - Express response object
   * @returns JSON response containing the application if found, or 404 error if not found
   */
  async one(request: Request, response: Response) {
    const applicationId = parseInt(request.params.id);
    const application = await this.applicationRepository.findOne({
      where: { applicationId },
    });

    if (!application) {
      return response.status(404).json({ message: "Application not found" });
    }
    return response.json(application);
  }
  /**
   * Creates a new application in the database
   * @param request - Express request object containing application details in body
   * @param response - Express response object
   * @returns JSON response containing the created application or error message
   */
  async save(request: Request, response: Response) {
    const application = this.applicationRepository.create(request.body);

    try {
      await this.applicationRepository.save(application);
    } catch (error) {
      return response.status(500).json({ message: "Error saving application", error });
    }
  }

  /**
   * Deletes an application from the database by its Id
   * @param request - Express request object containing the application userName in params
   * @param response - Express response object
   * @returns JSON response with success message or 404 error if application not found
   */
  async remove(request: Request, response: Response) {
    const applicationId = parseInt(request.params.id);
    const applicationToRemove = await this.applicationRepository.findOne({
      where: { applicationId },
    });

    if (!applicationToRemove) {
      return response.status(404).json({ message: "Application not found" });
    }

    await this.applicationRepository.remove(applicationToRemove);
    return response.json({ message: "Application removed successfully" });
  }

  /**
   * Updates an existing application's information
   * @param request - Express request object containing application ID in params and updated details in body
   * @param response - Express response object
   * @returns JSON response containing the updated application or error message
   */
  async update(request: Request, response: Response) {
    const applicationId = parseInt(request.params.id);

    let applicationToUpdate = await this.applicationRepository.findOne({
      where: { applicationId },
    });

    if (!applicationToUpdate) {
      return response.status(404).json({ message: "Application not found" });
    }

    const updatedApplication: Application  = {
        ...applicationToUpdate,
        ...request.body,
    };

    try {
      await this.applicationRepository.save(updatedApplication);
      return response.json(updatedApplication);
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error updating application", error });
    }
  }
  async findByUser(request: Request, response: Response) {
    const applicantUserName = request.params.userName;
    if (!applicantUserName) {
      return response.status(400).json({ message: "Applicant userName is required" });
    }
    console.log("Finding applications for user:", applicantUserName);
    const applications = await this.applicationRepository.find({
      where: { user: { userName: applicantUserName } },
    });
    console.log("Applications found:", applications);

    return response.json(applications);
}
async findByEvent(request: Request, response: Response) {
    const eventId = parseInt(request.params.eventId);
    const applications = await this.applicationRepository.find({
      where: { event: { eventId } },
    });

    return response.json(applications);
}

async findUserRating(request: Request, response: Response) {
  //Reference:
  //https://stackoverflow.com/questions/54684928/how-to-use-parameterized-query-using-typeorm-for-postgres-database-and-nodejs-as
  //https://github.com/typeorm/typeorm/issues/881  
    const applicantUserName = request.params.userName;
    console.log("Calculating rating for user:", applicantUserName);
    const query = 
      `SELECT AVG(rating) as averageRating
      FROM application
      WHERE "applicantUserName" = @0 
      AND rating IS NOT NULL`;
    const result = await this.applicationRepository.query(query, [applicantUserName]);
    console.log("Rating query result:", result);
    return response.json(result[0].averageRating);
    // Return 0 if there are no ratings
}

async findUnavailableDatesForEvent(request: Request, response: Response) {
  const eventId = parseInt(request.params.eventId);
  const query = 
    `SELECT "startDate", "endDate"
    FROM application
    WHERE "eventId" = @0 
    AND status = 'approved'`;
  const result = await this.applicationRepository.query(query, [eventId]);
  return response.json(result);
}

async autoDeclineOverlappingApplications(request: Request, response: Response) {
  const eventId = parseInt(request.params.eventId);
  const { startDate, endDate } = request.body;
  const query = 
    `UPDATE application
    SET status = 'rejected'
    WHERE "eventId" = @0 
    AND status = 'pending'
    AND (
      ("startDate" <= @1 AND "endDate" >= @1) OR
      ("startDate" <= @2 AND "endDate" >= @2) OR
      ("startDate" >= @1 AND "endDate" <= @2)
    )`;
    const result = await this.applicationRepository.query(query, [eventId, startDate, endDate]);
    return response.json(result);
}
}