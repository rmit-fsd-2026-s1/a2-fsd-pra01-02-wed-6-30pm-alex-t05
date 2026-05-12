import { Router } from "express";
import { ApplicationController } from "../controller/ApplicationController";

const router = Router();
const applicationController = new ApplicationController();

router.get("/applications", async (req, res) => {
  await applicationController.all(req, res);
});

router.get("/applications/:id", async (req, res) => {
  await applicationController.one(req, res);
});

router.post("/applications", async (req, res) => {
  await applicationController.save(req, res);
});

router.put("/applications/:id", async (req, res) => {
  await applicationController.update(req, res);
});

router.delete("/applications/:id", async (req, res) => {
  await applicationController.remove(req, res);
});

router.get("/users/:userName/applications", async (req, res) => {
  await applicationController.findByUser(req, res);
});

router.get("/events/:eventId/applications", async (req, res) => {
  await applicationController.findByEvent(req, res);
});

router.get("/users/:userName/rating", async (req, res) => {
  await applicationController.findUserRating(req, res);
});

export default router;
