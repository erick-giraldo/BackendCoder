import http from 'http'
import app from './app.js'
import { init } from './socket.js'

const PORT = process.env.NODE_PORT || 8080
const ENV = process.env.NODE_ENV || 'local'


const server = http.createServer(app)

init(server)

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}/ in ${ENV} environment.`)
})
