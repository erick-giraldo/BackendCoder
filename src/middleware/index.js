import { isValidToken, validatePassword } from "../utils/hash.js";
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
      logger.warning(`El campo [ ${field} ] es obligatorio`);
      throw new Error(`El campo [ ${field} ] es obligatorio`);
    }
  }
};

//Sessions

export const validLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const requiredFields = ["email", "password"];
    validateFields(requiredFields, req.body);

    const user = await UsersService.getOne({ email });

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

    const user = await UsersService.getOne({ email });
    if (user) {
      logger.warning(`usuario ${email} ya existe`);
      throw new Error("usuario ya existe");
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

    const user = await UsersService.getOne({ email });

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

    const user = await UsersService.getOne({ email });

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

      const user = await UsersService.getOne({ email: isToken.email });
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Products

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

export const validAddProduct = async (req, res, next) => {
  try {
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
    validateFields(requiredFields, data); // validateFieldsProducts(requiredFields, data);
    next();
  } catch (err) {
    next(err);
  }
};

export const validUpdateProduct = async (req, res, next) => {
  try {
    let error = {};
    let { pid } = req.params;
    let productData = req.body;
    if (isEmpty(productData))
      throw new Error("No se ha ingresado ningún elemento a actualizar");
    let productById = await ProductsService.getOne({ _id: pid });
    if (isEmpty(productById)) {
      logger.warning("No se encontró ningún producto con ese id");
      throw new Error("No se encontró ningún producto con ese id");
    }

    const allowedFields = [
      "name",
      "description",
      "price",
      "status",
      "stock",
      "category",
      "image",
      "status",
    ];

    if ("code" in productData) {
      error["code"] = "No se puede cambiar el valor de parametro código";
      delete productData.code;
    }

    const extraFields = Object.keys(productData).filter(
      (field) => !allowedFields.includes(field)
    );

    if (extraFields.length > 0) {
      error["extraFields"] = "No se pueden enviar propiedades adicionales";
    }

    Object.keys(productData).forEach((field) => {
      if (allowedFields.includes(field) && isEmpty(productData[field])) {
        error[field] = "El campo no puede estar vacío";
      }
      if (!allowedFields.includes(field)) {
        error[field] = "El campo no está permitido";
      }
    });

    if (Object.keys(error).length > 0) {
      return res.status(400).json({ error });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const validateDeleteProduct = async (req, res, next) => {
  try {
    let { pid } = req.params;
    let productById = await ProductsService.getOne({ _id: pid });
    if (isEmpty(productById)) {
      logger.warning("No se encontró ningún producto con ese id");
      throw new Error("No se encontró ningún producto con ese id");
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Cart

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

export const viewAddProductCart = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const productById = await ProductsService.getOne({ _id: pid });
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

//Views

export const authHome = (req, res, next) => {
  res.redirect("/login");
};

export const isLoged = (req, res, next) => {
  if (!req.cookies.token) {
    return next();
  }
  res.redirect("/products");
};



//Users

export const authenticatedUser = (req, res, next) => {
  const token = req.cookies.token;
  const isToken = isValidToken(token);
  if (isEmpty(isToken)) {
    logger.warning("Se produjo un error al obtener token.");
    throw new Error("Se produjo un error al obtener token.");
  }
  next();
};

export const validateDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = await UsersService.getById(id);
    const currentUserId = req.user;

    if (isEmpty(userId) || isEmpty(currentUserId)) {
      throw new Error ( "Usuario Invalido" );
    }

    if (userId._id.equals(currentUserId.id)) {
      console.log("true")
      throw new Error ("No se puede eliminar asimismo" );
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const isDocumentLoaded = (documents = [], docName) => {
  return documents.some(doc => doc.name === docName);
};

const validateDocuments = async (user) => {
  const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
  const missingDocuments = [];

  requiredDocuments.forEach(docName => {
    if (!isDocumentLoaded(user.documents, docName)) {
      missingDocuments.push(docName);
    }
  });

  if (missingDocuments.length === 0) {
    return { isValid: true, missingDocuments: [] };
  } else {
    return { isValid: false, missingDocuments };
  }
};

export const authenticateChangeRole = async (req, res, next) => {
  const token = req.cookies.token;
  const { id } = req.params;
  const isToken = isValidToken(token);
  if (isEmpty(isToken)) {
    logger.warning("Se produjo un error al obtener token.");
    throw new Error("Se produjo un error al obtener token.");
  }

  const user = await UsersService.getById(id);
  if (isEmpty(user)) {
    throw new Error(
      JSON.stringify({ detail: "El usuario no fue encontrado" })
    );
  }

  const newRole = getNewRole(user.role); // Obtener el nuevo rol basado en el rol actual
  if (!newRole) {
    throw new Error("Solo se puede cambiar roles por 'user' o 'premium'");
  }

  if (user.role.toUpperCase() === "USER" && newRole.toUpperCase() === "PREMIUM") {
    const validatedocs = await validateDocuments(user);
    if (!validatedocs.isValid) {
      const missingDocsString = validatedocs.missingDocuments.join(", ");
      throw new Error(
        `Debes subir estos documentos para poder cambiar el rol: <strong> [ ${missingDocsString} ] </strong>`
      );
    }
  }

  next();
};

const getNewRole = (currentRole) =>{
  const roleMap = {
    USER: "PREMIUM",
    PREMIUM: "USER",
  };
  return roleMap[currentRole.toUpperCase()] || null;
}


