const { v4: uuid } = require("uuid");

const users = [
  {
    id: uuid(),
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // demo only
    role: "admin",
  },
  {
    id: uuid(),
    name: "Demo User",
    email: "user@example.com",
    password: "user123",
    role: "user",
  },
];

const tasks = [
  {
    id: uuid(),
    title: "Draft product brief",
    description: "Outline the main goals for the new release",
    status: "pending",
    createdAt: new Date().toISOString(),
    ownerId: users[0].id,
  },
  {
    id: uuid(),
    title: "Prepare sprint board",
    description: "Add tickets and estimates for sprint planning",
    status: "completed",
    createdAt: new Date().toISOString(),
    ownerId: users[1].id,
  },
];

const sessions = new Map();

module.exports = {
  users,
  tasks,
  sessions,
};
