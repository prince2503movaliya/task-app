const mongoose = require("mongoose");
const {user} = require("./User.js");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  priority: {
    type: String,
    default: "Medium"
  },
  status: {
    type: String,
    default: "Pending"
  },
  dueDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },

  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},  { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);