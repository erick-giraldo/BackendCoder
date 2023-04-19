import { createHash, validatePassword } from "../utils/hash.js";
import UserModel from "../dao/models/users.js";

export const validRegister = async (req, res, next) => {
  const body = {
    first_name: "Jorge",
    last_name: "Perez",
    email: req.body.email,
    age: 20,
    occupation: "Ingeniero",
    password: req.body.password.length > 0 ? createHash(req.body.password) : "",
  };
  const requiredFields = [
    "first_name",
    "last_name",
    "email",
    "age",
    "occupation",
    "password",
  ];
  const userData = requiredFields.map((it) => {
    if (!body[it]) {
      return new Error(`El campo ${it} es obligatorio`);
    }
    return body[it];
  }, {});

  const firstError = userData.filter((it) => it instanceof Error)[0];
  if (firstError) return res.status(500).json({ message: firstError.message });

  const user = await UserModel.findOne({ email: body.email });
  if (user) {
    return res.status(500).json({ message: "usuario ya existe" });
  }

  return next();
};

export const validLogin = async (req ) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Los campos email and password son requeridos",
    });
  }

  user = await UserModel.findOne({ email });
  if (empty(user) || user.password !== password) {
    return res.status(400).json({
      message:
        "Credenciales invalidas por favor revisar y volver a iniciar sesión",
    });
  }
}