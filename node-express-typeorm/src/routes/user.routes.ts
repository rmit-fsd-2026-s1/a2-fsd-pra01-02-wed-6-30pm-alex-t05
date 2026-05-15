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

//finds comments for a hirer by a vendor by their usernames
router.get("/users/:vendorUserName/comments/:hirerUserName", async (req, res) => {
  await userController.findComments(req, res);
});

//sets a comment for a hirer by a vendor by their usernames
router.post("/users/:vendorUserName/comments/:hirerUserName", async (req, res) => {
  await userController.setUserCommentFromVendor(req, res);
});

//deletes comments
router.delete("/users/:vendorUserName/comments/:hirerUserName", async (req, res) => {
  await userController.deleteUserCommentFromVendor(req, res);
});

router.get("/users/:userName/preferredEvents", async (req, res) => {
  await userController.getAllPreferredEvents(req, res);
});

export default router;