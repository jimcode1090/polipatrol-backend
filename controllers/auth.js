import bcrypt from "bcryptjs";
import { User, Role } from "../models/index.js";
import { jwt } from "../utils/index.js";

async function ensureDefaultRoles() {
  // Verificar si el rol 'basic' existe en la base de datos
  const basicRole = await Role.findOne({ name: "basic" });

  if (!basicRole) {
    // Si no existe, crear el rol 'basic'
    await Role.create({ name: "basic" });
  }

  return basicRole;
}
async function register(req, res) {
  const { number_cip, email, password } = req.body;

  try {
    // Asegurarse de que el rol 'basic' existe en la base de datos
    const basicRole = await ensureDefaultRoles();
    
    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ number_cip: number_cip });
    if (existingUser) {
      return res.status(400).send({ msg: "El usuario ya está registrado." });
    }

    // Crear el nuevo usuario
    const user = new User({
      number_cip: number_cip,
      email: email,
    });

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    user.password = hashPassword;

    // Asignar el rol 'basic' al usuario
    user.roles = [basicRole._id];

    // Guardar el usuario en la base de datos
    await user.save();

    // Responder con los datos del usuario registrado
    res.status(201).send({
      msg: "Usuario registrado correctamente",
      user: {
        number_cip: user.number_cip,
        roles: user.roles,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al registrar el usuario" });
  }
}

async function login(req, res) {
  const { number_cip, password } = req.body;

  console.log(number_cip, password);
  try {

    const userStorage = await User.findOne({ number_cip: number_cip });

    if (!userStorage) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, userStorage.password);

    if (!isMatch) {
      return res.status(400).send({ msg: "Contraseña incorrecta" });
    }

    // Generar y devolver tokens
    const accessToken = jwt.createAccessToken(userStorage);
    const refreshToken = jwt.createRefreshToken(userStorage);

    return res.status(200).send({
      access: accessToken,
      refresh: refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Error del servidor" });
  }
}

async function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;

  // Validar si se proporciona el refreshToken
  if (!refreshToken) {
    return res.status(400).send({ msg: "Token requerido" });
  }

  // Verificar si el refreshToken ha expirado
  const hasExpired = jwt.hasExpiredToken(refreshToken);
  if (hasExpired) {
    return res.status(400).send({ msg: "Token expirado" });
  }

  try {
    // Decodificar el refreshToken y obtener el ID de usuario
    const { user_id } = jwt.decoded(refreshToken);

    // Buscar al usuario en la base de datos
    const userStorage = await User.findById(user_id);
    if (!userStorage) {
      return res.status(404).send({ msg: "Usuario no encontrado" });
    }

    // Generar un nuevo accessToken
    const accessToken = jwt.createAccessToken(userStorage);

    // Enviar el nuevo accessToken al cliente
    return res.status(200).send({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Error del servidor" });
  }
}

export const AuthController = {
  register,
  login,
  refreshAccessToken,
};
