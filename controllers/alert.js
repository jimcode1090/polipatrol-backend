import { Alert } from "../models/index.js";

async function getAlerts(req, res) {
  try {
    const { statusAlert } = req.query;
    console.log(statusAlert);
    let alerts = null;

    if (statusAlert === undefined) {
      alerts = await Alert.find().populate(
        "user",
        "rank first_name last_name phone number_cip"
      ).populate('user_attend', 'rank first_name last_name phone number_cip');
    } else {
      alerts = await Alert.find({ status: statusAlert }).populate(
        "user",
        "rank first_name last_name phone number_cip"
      );
    }

    if (!alerts || alerts.length === 0) {
      return res.status(400).send({ msg: "No se han encontrado alertas" });
    } else {
      return res.status(200).send(alerts);
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function createAlert(req, res) {

  try {
    const { user_id } = req.user;
    const alertData = req.body;
    console.log("Datos de la alerta", alertData);
    const alert = new Alert(alertData);
    alert.user = user_id;
    await alert.save();

     // Poblar los detalles del usuario, para incluir toda la información en la respuesta
    const populatedAlert = await Alert.findById(alert._id).populate('user', 'number_cip first_name last_name phone rank');

     // Devolver la alerta con los datos del usuario
     res.status(201).send(populatedAlert);
  } catch (error) {
    handleError(res, error);
  }
}

async function attendAlert(req, res) {
  try {
    const { user_id } = req.user;
    const { alert_id } = req.params;

    const alert = await Alert.findById({ _id: alert_id });

    if (!alert) {
      return res.status(404).send({ msg: "Alerta no encontrado" });
    }

    alert.status = "READ";
    alert.user_attend = user_id;
    await alert.save();
    res.status(200).send(alert);

  } catch (error) {
    handleError(res, error);
  }
}

function handleError(res, error) {
  console.error(error);
  res.status(500).send({ msg: "Error del servidor" });
}

export const AlertController = {
  getAlerts,
  createAlert,
  attendAlert,
};
