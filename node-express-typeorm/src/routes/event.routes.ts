import { Router } from "express";
import { EventController } from "../controller/EventController";

const router = Router();
const eventController = new EventController();

router.get("/events", async (req, res) => {
  await eventController.all(req, res);
});

router.get("/events/:id", async (req, res) => {
  await eventController.one(req, res);
});

router.post("/events", async (req, res) => {
  await eventController.create(req, res);
});

router.put("/events/:id", async (req, res) => {
  await eventController.update(req, res);
});

router.delete("/events/:id", async (req, res) => {
  await eventController.remove(req, res);
});

router.get("/users/:userName/events", async (req, res) => {
  await eventController.findByUser(req, res);
});


export default router;
