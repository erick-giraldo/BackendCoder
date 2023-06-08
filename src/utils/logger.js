import winston, { format } from "winston";
const customerLogger = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
};

const developmentLogger = winston.createLogger({
  levels: customerLogger.levels,
  format: winston.format.combine(
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console({ level: "debug" })],
});

const productionLogger = winston.createLogger({
  levels: customerLogger.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({
      filename: "./logs/errors.log",
      level: "error",
    }),
  ],
});
const getLogger = () => {
  if (process.env.NODE_ENV === "produccion") {
    return productionLogger;
  }
  return developmentLogger;
};

export default getLogger;
