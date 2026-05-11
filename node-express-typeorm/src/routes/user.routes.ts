import { Router } from "express";
import { UserController } from "../controller/UserController";

const router = Router();
const userController = new UserController();

// Gets all users
router.get("/users", async (req, res) => {
  await userController.all(req, res);
});

// Gets a user by their id
router.get("/users/:userName", async (req, res) => {
  await userController.one(req, res);
});

// Creates a new user
router.post("/users", async (req, res) => {
  await userController.save(req, res);
});

// Updates a user by their id
router.put("/users/:userName", async (req, res) => {
  await userController.update(req, res);
});

// Deletes a user by their id
router.delete("/users/:userName", async (req, res) => {
  await userController.remove(req, res);
});

export default router;
