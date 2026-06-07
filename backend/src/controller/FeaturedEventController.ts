import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Event } from "../entity/Event";
import { FeaturedEvents } from "../entity/FeaturedEvents";


export class FeaturedEventController {
    private featuredEventRepository = AppDataSource.getRepository(FeaturedEvents);

    /**
     * Retrieves all Featured Event from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all events
     */
    async all(request: Request, response: Response) {
        const featuredevents = await this.featuredEventRepository.find({
            relations: ["event"],
        });
        response.json(featuredevents);
    }

    /**
     * Retrieves a single Featured Event by its ID
     * @param request - Express request object containing the event ID in params
     * @param response - Express response object
     * @returns JSON response containing the event if found, or 404 error if not found
     */
    async one(request: Request, response: Response) {
        const id = parseInt(request.params.id);
        const featuredevent = await this.featuredEventRepository.findOne({
            where: { FeaturedId: id },
            relations: ["event"],
        });

        if (!featuredevent) {
            return response.status(404).json({ message: "Featured event not found" });
        }

        response.json(featuredevent);
    }
}