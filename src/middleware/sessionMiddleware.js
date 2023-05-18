import SessionController from "../controllers/SessionsController.js";
import { createHash, validatePassword } from "../utils/hash.js";
import UsersService from "../services/users.service.js";
import empty from "is-empty";

const validateFields = (requiredFields, data) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`El campo ${field} es obligatorio`);
    }
  }
};

export const validRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hash = password ? createHash(password) : "";

    const body = {
      first_name: "Jorge",
      last_name: "Perez",
      email,
      age: 20,
      occupation: "Ingeniero",
      password: hash,
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

    const user = await UsersService.getOne(email);
    if (user) {
      throw new Error("usuario ya existe");
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const requiredFields = ["email", "password"];
    validateFields(requiredFields, req.body);

    const isAdminUser =
      email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;
    const user = isAdminUser
      ? {
        first_name: process.env.ADMIN_NAME,
        last_name: "",
        role: "admin",
        email: process.env.ADMIN_EMAIL,
        password: createHash(process.env.ADMIN_PASSWORD),
        }
      : await UsersService.getOne(email);

    if (empty(user)) {
      throw new Error("Usuario no encontrado, por favor intente nuevamente");
    }

    if (!validatePassword(password, user)) {
      throw new Error(
        "El password no es correcto, por favor intente nuevamente"
      );
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validResetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const requiredFields = ["email", "password"];
    validateFields(requiredFields, req.body);

    const user = await UsersService.getOne(email);

    if (empty(user)) {
      throw new Error("Usuario no encontrado, por favor intente nuevamente");
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export  const authHome = (req, res, next) => {
  res.redirect('/login')    
}

export const isLoged = (req, res, next) => {
  if (!req.cookies.token) {
    return next()
  }
  res.redirect('/products')    
}


export const loginMiddleware = (req, res, next) => {
  return SessionController.login(req, res);
};

export const registerMiddleware = (req, res, next) => {
  return SessionController.register(req, res);
};

export const resetPasswordMiddleware = (req, res, next) => {
    return SessionController.resetPassword(req, res);
  };

export const errorMiddleware = (err, req, res, next) => {
  res.status(500).json({ message: err.message });
};
