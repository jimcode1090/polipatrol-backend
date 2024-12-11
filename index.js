import mongoose from "mongoose";
import { server } from "./app.js";
import {
  IP_SERVER,
  PORT,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_APP_NAME,
} from "./constants.js";
import { io } from "./utils/index.js";

const mongoDbUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_APP_NAME}?retryWrites=true&w=majority&appName=${DB_APP_NAME}`;
const mongoDbLocal = "mongodb://localhost/PoliPatrol";

mongoose.set("strictQuery", false);
mongoose.connect(mongoDbUrl, (error) => {
  if (error) throw error;

  server.listen(PORT, () => {
    console.log("######################");
    console.log("###### API REST ######");
    console.log("######################");
    console.log(`http://${IP_SERVER}:${PORT}/api`);

    io.sockets.on("connection", (socket) => {
      console.log("NUEVO USUARIO CONECTADO");

  
      socket.on("subscribe", (room) => {
        socket.join(room);
      });

      socket.on("unsubscribe", (room) => {
        socket.leave(room);
      });

      socket.on("sendSupportAlert", (alert) => {
        // console.log("Alerta recibida: ", alert);
        // Emite la alerta recibida a todos los clientes conectados
        io.emit("receiveSupportAlert", alert);
      });

      socket.on("sendCoords", (coords) => {
        console.log("Coordenada recibida: ", coords);
        // Emite la alerta recibida a todos los clientes conectados
        io.emit("receiveCoords", coords);
      });


      socket.on("disconnect", () => {
        console.log("USUARIO DESCONECTADO");
      });

    });
  });
});
