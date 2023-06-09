import isEmpty from "is-empty";
import EnumsError from "./EnumsError.js";
import getLogger from "../../utils/logger.js";

const logger = getLogger();

export default (error, req, res, next) => {
logger.error(error);
const statusCode = error.statusCode || 500;
const success = false;
const message = error.message;

  if(!isEmpty(error.cause)){
    logger.error("MiddlewareError ====>", [error.cause]);
    switch (error.code) {
      case EnumsError.INVALID_TYPES_ERROR:
        res.status(400).send({ status: "error", error: error.name });
        break;
      case EnumsError.INVALID_PARAM_ERROR:
        res.status(400).send({ status: "error", error: error.name });
        break;
      case EnumsError.DATABASE_ERROR:
        res.status(500).send({ status: "error", error: error.name });
        break;
      default:
        res.send({ status: "error", error: "Unhandled error" });
  }
  } else if(!isEmpty(error.url)){
    logger.error(error.url, { success, message, statusCode });
    res.render(error.url, { success, message, statusCode });
  } else {
    logger.error({ success, message });
      res.status(statusCode).json({ success, message });
    }
}
