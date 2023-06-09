import { format, transports, createLogger } from "winston";
import config from '../config/index.js'

const { combine, timestamp, label, prettyPrint } = format;

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

const developmentLogger = createLogger({
  levels: customerLogger.levels,
  format: combine(
    label({ label: 'right meow!' }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [new transports.Console({ level: "debug" })],
});

const productionLogger = createLogger({
  levels: customerLogger.levels,
  format: combine(
    label({ label: 'right meow!' }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [
    new transports.Console({ level: "info" }),
    new transports.File({
      filename: "./logs/errors.log",
      level: "error",
    }),
  ],
});

const getLogger = () => {
  if (config.nodeEnv === "produccion") {
    return productionLogger;
  }
  return developmentLogger;
};

export default getLogger;
