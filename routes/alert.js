import express from "express";
import { AlertController } from "../controllers/index.js";
import { mdAuth } from "../middlewares/index.js";

const api = express.Router();

api.get("/alerts", [mdAuth.asureAuth], AlertController.getAlerts);
api.post("/alerts", [mdAuth.asureAuth], AlertController.createAlert);
api.patch("/alerts/attend_alert/:alert_id", [mdAuth.asureAuth], AlertController.attendAlert);

export const alertRoutes = api;

