const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/tasks", isAuthenticated, taskController.getTasks);

router.get("/tasks/new", isAuthenticated, taskController.newTaskForm);

router.post("/tasks", isAuthenticated, taskController.createTask);

router.get("/tasks/pending", isAuthenticated, taskController.getPendingTasks);

router.get("/tasks/completed", isAuthenticated, taskController.getCompletedTasks);

router.get("/tasks/progress", isAuthenticated, taskController.getProgressTasks);

router.get("/tasks/:id/edit", isAuthenticated, taskController.editTaskForm);

router.post("/tasks/:id/update", isAuthenticated, taskController.updateTask);

router.post("/tasks/:id/delete", isAuthenticated, taskController.deleteTask);

module.exports = router;