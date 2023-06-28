import SessionController from "../controllers/SessionsController.js";
import { createHash, isValidToken, validatePassword } from "../utils/hash.js";
import ProductsService from "../services/products.service.js";
import UsersService from "../services/users.service.js";
import isEmpty from "is-empty";
import CartService from "../services/carts.service.js";
import { generatorProdError } from "../utils/errors/MessagesError.js";
import EnumsError from "../utils/errors/EnumsError.js";
import CustomError from "../utils/errors/CustomError.js";
import getLogger from "../utils/logger.js";
import moment from "moment";
import "moment-timezone";
import Exception from "../utils/exception.js";

const logger = getLogger();

const validateFields = (requiredFields, data) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      logger.warning(`El campo ${field} es obligatorio`);
      throw new Error(`El campo ${field} es obligatorio`);
    }
  }
};

const validateFieldsProducts = (requiredFields, data) => {
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    const error = CustomError.createError({
      name: "Product creating error",
      cause: generatorProdError(data),
      message: "Error trying to create Product",
      code: EnumsError.INVALID_TYPES_ERROR,
    });
    throw error;
  }
};

export const validLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const requiredFields = ["email", "password"];
    validateFields(requiredFields, req.body);

    const user =  await UsersService.getOne(email);

    if (isEmpty(user)) {
      logger.error(
        `Usuario ${email} no encontrado, por favor intente nuevamente`
      );
      throw new Error("Usuario no encontrado, por favor intente nuevamente");
    }

    if (!validatePassword(password, user)) {
      logger.error("El password no es correcto, por favor intente nuevamente");
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

    if (isEmpty(user)) {
      logger.warning(`Usuario no encontrado, por favor intente nuevamente`);
      throw new Error("Usuario no encontrado, por favor intente nuevamente");
    }
    if (validatePassword(password, user)) {
      logger.warning(
        "El password no puede ser el mismo, por favor intente nuevamente"
      );
      throw new Error(
        "El password no puede ser el mismo, por favor intente nuevamente"
      );
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const requiredFields = ["email"];
    validateFields(requiredFields, req.body);

    const user = await UsersService.getOne(email);

    if (isEmpty(user)) {
      logger.warning(`Usuario no encontrado, por favor intente nuevamente`);
      throw new Error("Usuario no encontrado, por favor intente nuevamente");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const viewResetPassword = async (req, res, next) => {
  try {
    const path = req.baseUrl ? "" : req.path;
    const url = path.split("/")[1];

    if (isEmpty(req.query)) {
      logger.warning(`No tienes permiso para acceder a esa página.`);
      return next(
        new Exception("No tienes permiso para acceder a esa página.", 401, url)
      );
    }

    const { token } = req.query;
    const isToken = isValidToken(token);

    if (isEmpty(isToken)) {
      logger.warning(`El enlace ha expirado. Por favor, genere uno nuevo.`);
      return next(
        new Exception(
          "El enlace ha expirado. Por favor, genere uno nuevo.",
          401,
          url
        )
      );
    } else {
      const expiration = isToken.exp;
      const ahora = moment().tz("America/Lima");
      const fechaExpiracion = moment(expiration * 1000).tz("America/Lima");

      if (!ahora.isBefore(fechaExpiracion)) {
        logger.warning(`El enlace ha expirado. Por favor, genere uno nuevo.`);
        throw new Error("El enlace ha expirado. Por favor, genere uno nuevo.");
      }

      const user = await UsersService.getOne(isToken.email);
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validRegister = async (req, res, next) => {
  try {
    const { email } = req.body;

    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "age",
      "password",
    ];

    validateFields(requiredFields, req.body);

    const user = await UsersService.getOne(email);
    if (user) {
      logger.warning(`usuario ${email} ya existe`);
      throw new Error("usuario ya existe");
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validAddProduct = async (req, res, next) => {
  try {
    const { count = 50 } = req.query;
    let products = [];
    const requiredFields = [
      "name",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "image",
    ];
    const { ...data } = req.body;
    validateFieldsProducts(requiredFields, data);
    next();
  } catch (err) {
    next(err);
  }
};

export const validUpdateProduct = async (req, res, next) => {
  try {
    let error = {};
    let { pid } = req.params;
    const productData = req.body;
    pid = Number(pid);
    if (isNaN(pid)) throw new Error("El id tiene que ser de tipo numérico");
    if (isEmpty(productData))
      throw new Error("No se ha ingresado nungún elemento a actualizar");
    let productById = await ProductsService.getOne(pid);
    if (isEmpty(productById)) {
      logger.warning("No se encontró ningún producto con ese id");
      throw new Error("No se encontró ningún producto con ese id");
    }

    const allowedFields = [
      "name",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "image",
      "status",
    ];
    Object.keys(productData).forEach((field) => {
      if (allowedFields.includes(field) && isEmpty(productData[field])) {
        error[field] = "El campo no puede estar vacío";
      }
      if (!allowedFields.includes(field)) {
        error[field] = "El campo no esta permitido";
      }
    });
    if (!isEmpty(error)) throw new Error(error);
    if (!isEmpty(productData.code)) {
      const productByCode = await ProductsService.getCode(productData.code);
      if (!isEmpty(productByCode) && productByCode.id !== pid) {
        throw new Error(
          `El código ${productData.code} ya se encuentra regitrado`
        );
      }
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validateDeleteProduct = async (req, res, next) => {
  try {
    let { pid } = req.params;
    pid = Number(pid);
    if (isNaN(pid)) {
      logger.error("El id tiene que ser de tipo numérico");
      throw new Error("El id tiene que ser de tipo numérico");
    }
    let productById = await ProductsService.getOne(pid);
    if (isEmpty(productById)) {
      logger.warning("No se encontró ningún producto con ese id");
      throw new Error("No se encontró ningún producto con ese id");
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validateFieldsCart = async (req, res, next) => {
  try {
    let { cid } = req.params;
    cid = Number(cid);
    if (isNaN(pid)) {
      logger.error("El id tiene que ser de tipo numérico");
      throw new Error("El id tiene que ser de tipo numérico");
    }
    let productById = await CartService.getOne(cid);
    if (isEmpty(productById)) {
      logger.warning("No se encontró ningún producto con ese id");
      throw new Error("No se encontró ningún carrito con ese id");
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const validateDeleteCart = async (req, res, next) => {
  try {
    let { cid } = req.params;
    cid = Number(cid);
    if (isNaN(pid)) {
      logger.error("El id tiene que ser de tipo numérico");
      throw new Error("El id tiene que ser de tipo numérico");
    }
    let productById = await CartService.getOne(cid);
    if (isEmpty(productById)) {
      logger.warning("No se encontró ningún producto con ese id");
      throw new Error("No se encontró ningún carrito con ese id");
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const authHome = (req, res, next) => {
  res.redirect("/login");
};

export const isLoged = (req, res, next) => {
  if (!req.cookies.token) {
    return next();
  }
  res.redirect("/products");
};

export const authenticatedUser = (req, res, next) => {
  const token = req.cookies.token;
  const isToken = isValidToken(token);
  if (isEmpty(isToken)) {
    logger.warning("Se produjo un error al obtener token.");
    throw new Error("Se produjo un error al obtener token.");
  }
  next();
};

export const authenticateAndAuthorize = (req, res, next) => {
  const token = req.cookies.token;
  const role = req.body.role.toUpperCase();
  const isToken = isValidToken(token);
  if (isEmpty(isToken)) {
    logger.warning("Se produjo un error al obtener token.");
    throw new Error("Se produjo un error al obtener token.");
  }
  const userRoles = ["ADMIN", "PREMIUM"]; // Obtén los roles del usuario
  if (!userRoles.includes(role)) {
    return res.status(401).json({
      message: "Solo se puede Cambiar roles por Admin o premium",
    });
  }
  next();
};

export const viewAddProductCart = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const productById = await ProductsService.getById({ _id: pid });
    const token = await isValidToken(req.cookies.token);
    if (token.role === "premium" && token.email !== productById.owner) {
      logger.warning("`No puedes agregar un producto que no te pertenece.");
      throw new Error("`No puedes agregar un producto que no te pertenece.");
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
