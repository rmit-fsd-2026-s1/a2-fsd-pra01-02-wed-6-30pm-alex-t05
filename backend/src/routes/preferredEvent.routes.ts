import { Router } from "express";
import { PreferredEventController } from "../controller/PreferredEventController";

const router = Router();

const preferredEventController = new PreferredEventController();

// Gets all preferred events for a hirer by their username
router.get("/hirer/:userName/preferred-events", async (req, res) => {
    await preferredEventController.getAllPreferredEventsForUser(req, res);
});

export default router;