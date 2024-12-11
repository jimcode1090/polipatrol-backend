import express from "express";
import { UserController } from "../controllers/index.js";
import { mdAuth } from "../middlewares/index.js";

const api = express.Router();

api.get("/user/me", [mdAuth.asureAuth], UserController.getMe);
api.patch("/user/me", [mdAuth.asureAuth], UserController.updateUser);
api.get("/users", [mdAuth.asureAuth], UserController.getUsers);
api.get("/users/:id", [mdAuth.asureAuth], UserController.getUser);
api.patch("/user/:id", [mdAuth.asureAuth], UserController.updateUser);
api.delete("/user/:id", [mdAuth.asureAuth], UserController.deleteUser);
// api.get(
//   "/users_exept_participants_group/:group_id",
//   [mdAuth.asureAuth],
//   UserController.getUsersExeptParticipantsGroup
// );

export const userRoutes = api;
