import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { PreferredEvents } from "../entity/PreferredEvents";
import { User } from "../entity/User";


export class PreferredEventController {
    private preferredEventRepository = AppDataSource.getRepository(PreferredEvents);
    private userRepository = AppDataSource.getRepository(User);

    /**
     * Retrieves all Preferred Event for a hirer by their username
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all events
     */
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
}