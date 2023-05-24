import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "passport";
import multer from "multer";
import Exception from "./exception.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/imgs");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const JWT_SECRET = process.env.JWT_SECRET;

export const tokenGenerator = (user) => {
  const payload = {
    id: user._id,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    cart: user.cart,
    role: user.role,
  };
  const token = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  return token;
};

export const isValidToken = (token) => {
  try {
    const decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const validatePassword = (password, user) => {
  return bcrypt.compareSync(password, user.password);
};