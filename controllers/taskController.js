const Task = require("../models/Task");

// =======================
// Get All Tasks
// =======================

exports.getTasks = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    let tasks = await Task.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .lean();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Sort tasks by urgency
    tasks.sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") return 1;
      if (b.status === "Completed" && a.status !== "Completed") return -1;

      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      dateA.setHours(0, 0, 0, 0);
      dateB.setHours(0, 0, 0, 0);

      return dateA - dateB;
    });

    res.render("tasks/list", {
      tasks,
      pageTitle: "All Tasks",
      page: "tasks"
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


// =======================
// Pending Tasks
// =======================

exports.getPendingTasks = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const tasks = await Task.find({
      user: req.user.id,
      status: "Pending"
    }).lean();

    res.render("tasks/list", {
      tasks,
      pageTitle: "Pending Tasks",
      page: "pending"
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


// =======================
// Completed Tasks
// =======================

exports.getCompletedTasks = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const tasks = await Task.find({
      user: req.user.id,
      status: "Completed"
    }).lean();

    res.render("tasks/list", {
      tasks,
      pageTitle: "Completed Tasks",
      page: "completed"
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


// =======================
// In Progress Tasks
// =======================

exports.getProgressTasks = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const tasks = await Task.find({
      user: req.user.id,
      status: "In Progress"
    }).lean();

    res.render("tasks/list", {
      tasks,
      pageTitle: "In Progress Tasks",
      page: "progress"
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


// =======================
// Show Add Task Form
// =======================

exports.newTaskForm = (req, res) => {
  if (!req.user) return res.redirect("/login");

  res.render("tasks/create", {
    page: "new-task"
  });
};


// =======================
// Create Task
// =======================

exports.createTask = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      req.flash("error", "Task title is required");
      return res.redirect("/tasks/new");
    }

    await Task.create({
      title,
      description,
      priority,
      dueDate,
      status: "Pending", // ✅ default
      user: req.user.id
    });

    req.flash("success", "Task created successfully");
    res.redirect("/tasks");

  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to create task");
    res.redirect("/tasks/new");
  }
};


// =======================
// Edit Task Form
// =======================

exports.editTaskForm = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    }).lean();

    if (!task) return res.redirect("/tasks");

    res.render("tasks/edit", { task });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


// =======================
// Update Task
// =======================

exports.updateTask = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const result = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body
    );

    if (!result) {
      req.flash("error", "Task not found");
      return res.redirect("/tasks");
    }

    req.flash("info", "Task updated successfully");
    res.redirect("/tasks");

  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to update task");
    res.redirect(`/tasks/${req.params.id}/edit`);
  }
};


// =======================
// Delete Task
// =======================

exports.deleteTask = async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const result = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!result) {
      req.flash("error", "Task not found");
      return res.redirect("/tasks");
    }

    req.flash("danger", "Task deleted successfully");
    res.redirect("/tasks");

  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to delete task");
    res.redirect("/tasks");
  }
};