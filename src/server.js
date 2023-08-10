import http from 'http'
import app from './config/app.js'
import { init } from './config/socket.js'
import config from './config/index.js'
import getLogger  from "./utils/logger.js";
const PORT = config.port
const ENV = process.env.NODE_ENV || 'local'


const server = http.createServer(app)
const logger = getLogger();
init(server)

server.listen(PORT, "0.0.0.0", () => {
  logger.debug(`Server running in http://localhost:${PORT}/ in ${ENV} environment.`)
})
