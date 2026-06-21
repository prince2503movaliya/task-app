# TaskFlow – Task Management System

TaskFlow is a full-stack task management application that helps users organize, track, and manage daily tasks efficiently. Users can create tasks, assign priorities, update task status, search tasks, and manage their work from a centralized dashboard.

Built using Node.js, Express.js, MongoDB, and EJS following the MVC architecture.

---

## Features

- User authentication and authorization
- Create, update, delete, and view tasks
- Task priority management
- Task status tracking
- Search tasks by title or keyword
- Filter tasks based on priority and status
- Pagination for efficient task listing
- User-specific task management
- Responsive user interface
- Form validation and error handling
- Secure password handling
- MVC-based project structure

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend
- EJS
- HTML
- CSS
- JavaScript

### Tools & Libraries
- Express Session
- bcrypt
- dotenv
- connect-flash
- method-override

---

## Project Structure

```text
task-app/
│
├── config/              # Database configuration
├── controllers/         # Application business logic
├── middleware/          # Authentication and validation middleware
├── models/              # MongoDB schemas and models
├── public/              # Static files (CSS, JavaScript, images)
├── routes/              # Application routes
├── services/            # Reusable service logic
├── views/               # EJS templates
│
├── app.js               # Express application configuration
├── server.js            # Server entry point
├── package.json         # Dependencies and scripts
└── README.md
