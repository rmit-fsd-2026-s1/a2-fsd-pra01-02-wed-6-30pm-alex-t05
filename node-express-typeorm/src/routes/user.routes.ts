import { Router } from "express";
import { UserController } from "../controller/UserController";

const router = Router();
const userController = new UserController();

// ---User CRUD---
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
  await userController.create(req, res);
});

// Updates a user by their id
router.put("/users/:userName", async (req, res) => {
  await userController.update(req, res);
});

// Deletes a user by their id
router.delete("/users/:userName", async (req, res) => {
  await userController.remove(req, res);
});

// ---Vendor CRUD---
// Gets all events for a vendor
router.get("/users/:userName/events", async (req, res) => {
  await userController.getAllEventsForVendor(req, res);
});

// Gets a single event for a vendor by event id
router.get("/users/:userName/events/:eventId", async (req, res) => {
  await userController.getOneEventForVendor(req, res);
});

// event update

// Creates an event for a vendor
router.post("/users/:userName/events", async (req, res) => {
  await userController.createEventforVendor(req, res);
});

// Deletes an event for a vendor by event id
router.delete("/users/:userName/events/:eventId", async (req, res) => {
  await userController.removeEventforVendor(req, res);
});

// ---User Comments---
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

// ---Preferred Events---
// Gets all preferred events for a user
router.get("/users/:userName/preferredEvents", async (req, res) => {
  await userController.getAllPreferredEvents(req, res);
});

export default router;