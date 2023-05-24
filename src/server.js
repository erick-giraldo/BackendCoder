import http from 'http'
import app from './config/app.js'
import { init } from './config/socket.js'
import config from './config/index.js'

const PORT = config.port
const ENV = process.env.NODE_ENV || 'local'


const server = http.createServer(app)

init(server)

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}/ in ${ENV} environment.`)
})
