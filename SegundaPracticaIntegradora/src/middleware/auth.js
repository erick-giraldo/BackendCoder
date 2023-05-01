import { isValidToken } from "../utils/hash.js";

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No se ha proporcionado un token" });
    }
    const decoded = isValidToken(token);
    if (decoded) {
      req.user = decoded.user;
    }
  } catch (error) {
    res.redirect("/401");
    console.log(error)
  }
};

export default auth;
