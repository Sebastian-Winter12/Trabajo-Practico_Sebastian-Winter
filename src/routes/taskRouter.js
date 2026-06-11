import { Router } from "express";
import { getTasks, getTask, createTask, updateTask, deleteTask } from "../controllers/taskControllers.js";

const taskRouter = Router()

taskRouter.get("/", getTasks)
taskRouter.get("/:id", getTask)
taskRouter.post("/", createTask)
taskRouter.patch("/:id", updateTask)
taskRouter.delete("/:id", deleteTask)

export { taskRouter }