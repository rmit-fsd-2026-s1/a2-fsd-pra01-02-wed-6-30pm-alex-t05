import { Router } from "express";
import { FeaturedEventController } from "../controller/FeaturedEventController";

const router = Router();

const featuredEventController = new FeaturedEventController();

// Gets all featured events
router.get("/featuredevents", async (req, res) => {
    await featuredEventController.all(req, res);
});

// Gets a featured event by their id
router.get("/featuredevents/:id", async (req, res) => {
    await featuredEventController.one(req, res);
});

export default router;