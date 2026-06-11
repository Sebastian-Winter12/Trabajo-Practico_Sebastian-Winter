import { Task } from "../models/TaskModel.js";

// todas las tareas del usuario logueado
const getTasks = async (req, res) => {
  try {
    const userLogged = req.userLogged

    if (!userLogged || !userLogged.id) {
      return res.status(401).json({ 
        success: false, 
        error: "Unauthorized: No user identification found in request" 
      })
    }

    const filterTasks = await Task.find({ userId: userLogged.id }, { userId: 0 })
    res.json({
      success: true,
      data: filterTasks,
      message: "Tasks fetched successfully"
    })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching tasks" })
  }
}

// una tarea específica del usuario logueado por ID
const getTask = async (req, res) => {
  try {
    const id = req.params.id
    const foundTask = await Task.findOne({
      _id: id,
      userId: req.userLogged.id
    }, {
      userId: 0
    })
    if (!foundTask) return res.status(404).json({ success: false, error: "Task not found" })
    res.json({ success: true, data: foundTask, message: "Task fetched successfully" })
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid ID format" })
  }
}

// creación de una tarea para el usuario logueado
const createTask = async (req, res) => {
  try {
    const body = req.body
    const userLogged = req.userLogged

    if (!body.subject) {
      return res.status(400).json({ success: false, error: "subject is required" })
    }

    const newTask = await Task.create({
      subject: body.subject,
      description: body.description,
      priority: body.priority,
      dueDate: body.dueDate,
      completed: body.completed ?? false,
      userId: userLogged.id
    })

    const { userId, ...publicDataTask } = newTask.toObject()

    res.status(201).json({
      success: true,
      data: publicDataTask,
      message: "Task created successfully"
    })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error creating task" })
  }
}

// actualización de una tarea por ID para el usuario logueado
const updateTask = async (req, res) => {
  try {
    const id = req.params.id
    
    const { _id, ...safeBody } = req.body 

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.userLogged.id },
      safeBody,
      { returnDocument: 'after' }
    )

    if (!updatedTask) {
      return res.status(404).json({ success: false, error: "Task not found" })
    }

    const { userId: finalUserId, ...publicDataTask } = updatedTask.toObject()

    res.json({
      success: true,
      data: publicDataTask,
      message: "Task updated successfully"
    })
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid ID format" })
    }
    res.status(500).json({ success: false, error: e.message })
  }
}

// eliminación de una tarea por ID para el usuario logueado
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: req.userLogged.id
    })

    if (!deletedTask) {
      return res.status(404).json({ success: false, error: "Task not found" })
    }

    const { userId, ...publicDataTask } = deletedTask.toObject()

    res.json({ success: true, data: publicDataTask, message: "Task deleted successfully" })
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid ID format" })
  }
}

export { getTasks, getTask, createTask, updateTask, deleteTask }