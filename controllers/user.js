import { User } from "../models/index.js";
import { getFilePath } from "../utils/index.js";

async function getMe(req, res) {
  const { user_id } = req.user;

  try {
    const user = await User.findById(user_id)
      .populate("roles", "name -_id")
      .select(["-password"]);

    if (!user) {
      return res.status(400).send({ msg: "No se ha encontrado el usuario" });
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function getUsers(req, res) {
  try {
    const { user_id } = req.user;
    const { active } = req.query;
    let users = null;

    if (active === undefined) {
      users = await User.find({ _id: { $ne: user_id } })
      .populate("roles", "name")
      .select(["-password"]);
    }else {
      users = await User.find({ active: active, _id: { $ne: user_id } })
      .populate("roles", "name")
      .select(["-password"]);
    }


    if (!users || users.length === 0) {
      return res.status(400).send({ msg: "No se han encontrado usuarios" });
    } else {
      return res.status(200).send(users);
    }
  } catch (error) {
    handleError(res, error);
  }
}


async function getUser(req, res) {
  const { id } = req.params;

  try {
    const response = await User.findById(id)
    .populate("roles", "name")
    .select(["-password"]);

    if (!response) {
      res.status(400).send({ msg: "No se ha encontrado el usuario" });
    } else {
      res.status(200).send(response);
    }
  } catch (error) {
    handleError(res, error);
  }
}

async function updateUser(req, res) {
  try {
    const { user_id } = req.user;
    const userData = req.body;
    console.log(" req.body en el controlaDOR:",  req.body)
    const updatedUser = await updateUserData(user_id, userData);

    if (!updatedUser) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    handleError(res, error);
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;

  User.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el usuario" });
    } else {
      res.status(200).send({ msg: "Usuario eliminado" });
    }
  });
}

async function updateUserData(userId, userData) {
  console.log(userData);
  try {
    // Devolvemos el usuario actualizado sin el password y __v
    return await User.findByIdAndUpdate(userId, userData, { new: true }).select("-password -__v -roles");
  } catch (error) {
    console.log(error);
    throw new Error("Error al actualizar los datos del usuario");
  }
}

function handleError(res, error) {
  console.error(error);
  res.status(500).send({ msg: "Error del servidor" });
}
// async function getUsersExeptParticipantsGroup(req, res) {
//   const { group_id } = req.params;

//   const group = await Group.findById(group_id);
//   const participantsStrings = group.participants.toString();
//   const participants = participantsStrings.split(",");

//   const response = await User.find({ _id: { $nin: participants } }).select([
//     "-password",
//   ]);

//   if (!response) {
//     res.status(400).sedn({ msg: "No se ha encontrado ningun usuario" });
//   } else {
//     res.status(200).send(response);
//   }
// }

export const UserController = {
  getMe,
  getUsers,
  getUser,
  updateUser,
  deleteUser
  // getUsersExeptParticipantsGroup,
};
