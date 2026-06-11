import express from 'express'
import { config } from 'dotenv'
import { connectDb } from './config/mongoDbConnection.js';
import { taskRouter } from './routes/taskRouter.js';
import { AuthRouter } from './routes/authRouter.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import cors from 'cors'
config()

const entorno = "dev"
let PORT = 3000

if (entorno === "dev") {
  PORT = process.env.PORT
}

const server = express()
server.use(express.json())
server.use(cors())

server.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API REST con Express y MongoDB"
  })
})

server.use("/api/tasks", authMiddleware, taskRouter);
server.use("/api/auth", AuthRouter);

server.listen(PORT, () => {
  connectDb()
  console.log(`Servidor en escucha por el puerto http://localhost:${PORT}`)
})

server.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, error: "Internal server error" })
})

export { server }