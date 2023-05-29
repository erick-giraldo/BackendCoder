import SessionController from "../controllers/SessionsController.js";
import { createHash, validatePassword } from "../utils/hash.js";
import ProductsService from "../services/products.service.js";
import UsersService from "../services/users.service.js";
import isEmpty from "is-empty";
import CartService from "../services/carts.service.js";
import { generatorUserError } from "../utils/errors/MessagesError.js";
import EnumsError from "../utils/errors/EnumsError.js";
import CustomError from '../utils/errors/CustomError.js';

const validateFields = (requiredFields, data) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`El campo ${field} es obligatorio`);
    }
  }
};


const validateFieldsProducts = (requiredFields, data) => {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    const error = CustomError.createError({
      name: 'User creating error',
      cause: generatorUserError(data),
      message: 'Error trying to create user',
      code: EnumsError.INVALID_TYPES_ERROR,
    });
    
    throw error;
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

// export const validAddProduct = async (req, res, next) => {
//   try {
//     let error = {};
//     const productData = req.body;
//     const requiredFields = [
//       "description",
//       "code",
//       "name",
//       "price",
//       "stock",
//       "category",
//       "image",
//       "status",
//     ];
//     validateFields(requiredFields, productData);
//     next();
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


export const validAddProduct = async (req, res, next) => {
  try {
        const { count = 50 } = req.query;
        let products = [];
        const requiredFields = ['name', 'description', 'code', 'price', 'status', 'stock', 'category', 'image'];
        const { ...data } = req.body;
        
        validateFieldsProducts(requiredFields, data);
        
        next()
      } catch (err) {
        next(err)
  };
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

export const validateDeleteProduct = async ( req, res, next) => {
  try {
    let { pid } = req.params;
    pid = Number(pid);
    if (isNaN(pid)) throw new Error("El id tiene que ser de tipo numérico");
    let productById = await ProductsService.getOne(pid);
    if (isEmpty(productById)) {
      throw new Error("No se encontró ningún producto con ese id");
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const validateFieldsCart = async ( req, res, next) => {
  try {
    let { cid } = req.params;
    cid = Number(cid);
    if (isNaN(cid)) throw new Error("El id tiene que ser de tipo numérico");
    let productById = await CartService.getOne(cid);
    if (isEmpty(productById)) {
      throw new Error("No se encontró ningún carrito con ese id");
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const validateDeleteCart = async ( req, res, next) => {
  try {
    let { cid } = req.params;
    cid = Number(cid);
    if (isNaN(cid)) throw new Error("El id tiene que ser de tipo numérico");
    let productById = await CartService.getOne(cid);
    if (isEmpty(productById)) {
      throw new Error("No se encontró ningún carrito con ese id");
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const validLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const requiredFields = ["email", "password"];
    validateFields(requiredFields, req.body);

    const isAdminUser =
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD;
    const user = isAdminUser
      ? {
        first_name: process.env.ADMIN_NAME,
        last_name: "",
        role: "admin",
        email: process.env.ADMIN_EMAIL,
        password: createHash(process.env.ADMIN_PASSWORD),
      }
      : await UsersService.getOne(email);

    if (isEmpty(user)) {
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

    if (isEmpty(user)) {
      throw new Error("Usuario no encontrado, por favor intente nuevamente");
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
