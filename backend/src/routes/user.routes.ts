import { Router } from "express";
import { UserController } from "../controller/UserController";
import { validateDto } from "../middlewares/validate";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { UpdateUserDTO } from "../dtos/update-user.dto";
import { CreateEventDTO } from "../dtos/create-event.dto";
import { UpdateEventDTO } from "../dtos/update-event.dto";
import { CreateVendorCommentDTO } from "../dtos/create-vendorcomment.dto";
import { LoginDTO } from "../dtos/login.dto";

const router = Router();
const userController = new UserController();

// ---User---
// Gets all users
router.get("/users", async (req, res) => {
  await userController.all(req, res);
});

// Gets a user by their id
router.get("/users/:userName", async (req, res) => {
  await userController.one(req, res);
});

// Creates a new user
router.post("/users", validateDto(CreateUserDTO), async (req, res) => {
  await userController.create(req, res);
});

// Updates a user by their id
router.put("/users/:userName", validateDto(UpdateUserDTO), async (req, res) => {
  await userController.update(req, res);
});

// Deletes a user by their id
router.delete("/users/:userName", async (req, res) => {
  await userController.remove(req, res);
});

// User login
router.post("/users/login", validateDto(LoginDTO), async (req, res) => {
  await userController.login(req, res);
});

// ---Vendor CRUD---
// Gets all events for a vendor
router.get("/vendor/:userName/events", async (req, res) => {
  await userController.getAllEventsForVendor(req, res);
});

// Gets a single event for a vendor by event id
router.get("/vendor/:userName/events/:eventId", async (req, res) => {
  await userController.getOneEventForVendor(req, res);
});

// Creates an event for a vendor
router.post("/vendor/:userName/events", validateDto(CreateEventDTO), async (req, res) => {
  await userController.createEventforVendor(req, res);
});

// event update
router.put("/vendor/:userName/events/:eventId", validateDto(UpdateEventDTO), async (req, res) => {
  await userController.updateEventforVendor(req, res);
});

// Deletes an event for a vendor by event id
router.delete("/vendor/:userName/events/:eventId", async (req, res) => {
  await userController.removeEventforVendor(req, res);
});

// ---User Comments---
//finds comments for a hirer by a vendor by their usernames
router.get("/vendor/:vendorUserName/comments/:hirerUserName", async (req, res) => {
  await userController.findComments(req, res);
});

//sets a comment for a hirer by a vendor by their usernames
router.post("/vendor/:vendorUserName/comments/:hirerUserName", validateDto(CreateVendorCommentDTO), async (req, res) => {
  await userController.setUserCommentFromVendor(req, res);
});

//deletes comments
router.delete("/vendor/:vendorUserName/comments/:hirerUserName", async (req, res) => {
  await userController.deleteUserCommentFromVendor(req, res);
});

// ---Preferred Events---
// Gets all preferred events for a hirer by their username
router.get("/hirer/:userName/preferred-events", async (req, res) => {
  await userController.getAllPreferredEventsForUser(req, res);
});

// Adds a preferred event for a hirer by their username and event id
router.post("/hirer/:userName/preferred-events/:eventId", async (req, res) => {
  await userController.addPreferredEvent(req, res);
});

// Removes a preferred event for a hirer by their username and event id
router.delete("/hirer/:userName/preferred-events/:eventId", async (req, res) => {
  await userController.removePreferredEvent(req, res);
});
//compliance document upload
router.post("/hirer/:userName/compliance-document", async (req, res) => {
  await userController.uploadComplianceDocument(req, res);
});
//get compliance document count for user
router.get("/hirer/:userName/compliance-document/count", async (req, res) => {
  await userController.getComplianceDocCountForUser(req, res);
});

export default router;