import { Router } from "express";
import { EventController } from "../controller/EventController";
import { validateDto } from "../middlewares/validate";
import { CreateEventDTO } from "../dtos/create-event.dto";
import { UpdateEventDTO } from "../dtos/update-event.dto";

const router = Router();
const eventController = new EventController();

router.get("/events", async (req, res) => {
  await eventController.all(req, res);
});

router.get("/events/:id", async (req, res) => {
  await eventController.one(req, res);
});

router.get("/users/:userName/events", async (req, res) => {
  await eventController.findByUser(req, res);
});

router.post("/events", validateDto(CreateEventDTO), async (req, res) => {
  await eventController.create(req, res);
});

router.put("/events/:id", validateDto(UpdateEventDTO), async (req, res) => {
  await eventController.update(req, res);
});

router.delete("/events/:id", async (req, res) => {
  await eventController.remove(req, res);
});

router.get("/tags", async (req, res) => {
  await eventController.getAllTags(req, res);
});

router.get("/events/:eventId/tags", async (req, res) => {
  await eventController.getTagsForEvent(req, res);
});

router.post("/events/:eventId/tags", async (req, res) => {
  await eventController.setTagsForEvent(req, res);
});

router.get("/event-tags", async (req, res) => {
  await eventController.getAllEventTags(req, res);
});


export default router;
