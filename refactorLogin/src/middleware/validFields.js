import { createHash, validatePassword } from "../utils/hash.js";
import UserModel from "../dao/models/users.js";
import empty from "is-empty";

export const validateFields = (requiredFields, data) => {
  for (let field of requiredFields) {
    if (!data.hasOwnProperty(field) || data[field] === "") {
      throw new Error(`El campo ${field} es obligatorio`);
    }
  }
};

export const validRegister = async (req, res, next) => {
  try {
    const body = {
      first_name: "Jorge",
      last_name: "Perez",
      email: req.body.email,
      age: 20,
      occupation: "Ingeniero",
      password:
        req.body.password.length > 0 ? createHash(req.body.password) : "",
    };

    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "age",
      "occupation",
      "password",
    ];

    validateFields(requiredFields, body);

    const user = await UserModel.findOne({ email: body.email });
    if (user) {
      return res.status(500).json({ message: "usuario ya existe" });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const validLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const requiredFields = ["email", "password"];

    validateFields(requiredFields, req.body);

    const isAdminUser =
      email === "adminCoder@coder.com" && password === "adminCod3r123";

    const user = isAdminUser
      ? {
          first_name: "adminCoder",
          rol: "Admin",
          email: "adminCoder@coder.com",
          password: createHash("adminCod3r123"),
        }
      : await UserModel.findOne({ email });

    if (empty(user)) {
      return res.status(500).json({
        message: "Usuario no encontrado, por favor intente nuevamente",
      });
    }

    if (!validatePassword(password, user)) {
      return res.status(500).json({
        message: "El password no es correcto, por favor intente nuevamente",
      });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
