require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const connectDB = require("./config/db");
const User = require("./models/user");
const Task = require("./models/task");
const { seedInitialData } = require("./utils/seed");

const app = express();
const PORT = process.env.PORT || 4000;
const sessions = new Map();

app.use(cors());
app.use(express.json());

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  const { password, __v, ...rest } = user;
  return {
    ...rest,
    id: rest._id ? rest._id.toString() : rest.id,
    _id: undefined,
  };
};

const formatTask = (taskDoc) => {
  const task = taskDoc.toObject ? taskDoc.toObject() : taskDoc;
  return {
    id: task._id ? task._id.toString() : task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
    ownerId: task.owner?._id
      ? task.owner._id.toString()
      : task.owner?.toString?.(),
  };
};

const createToken = (userId) => `mock-token-${userId}-${uuid()}`;

const authRequired = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.replace("Bearer", "").trim();

    if (!token || !sessions.has(token)) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = sessions.get(token);
    const user = await User.findById(userId);

    if (!user) {
      sessions.delete(token);
      return res.status(401).json({ message: "Session expired" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

app.get("/", (_req, res) => {
  res.json({ message: "Task Manager API is running" });
});

app.post("/api/auth/signup", async (req, res, next) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === "admin" ? "admin" : "user",
    });

    const token = createToken(user.id);
    sessions.set(token, user.id);

    res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/signin", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user.id);
    sessions.set(token, user.id);

    res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/signout", authRequired, (req, res) => {
  sessions.delete(req.token);
  res.json({ message: "Signed out" });
});

app.get("/api/tasks", authRequired, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNumber - 1) * pageSize;

    const query = req.user.role === "admin" ? {} : { owner: req.user._id };

    if (status) {
      query.status = status;
    }

    const [total, taskDocs] = await Promise.all([
      Task.countDocuments(query),
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean({ getters: true }),
    ]);

    const totalPages = Math.max(Math.ceil(total / pageSize), 1);

    res.json({
      data: taskDocs.map((task) => formatTask(task)),
      meta: { total, page: pageNumber, limit: pageSize, totalPages },
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/tasks/:id", authRequired, async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "admin" && task.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this task" });
    }

    res.json(formatTask(task));
  } catch (error) {
    next(error);
  }
});

app.post("/api/tasks", authRequired, async (req, res, next) => {
  try {
    const { title, description = "", status = "pending" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      status: status === "completed" ? "completed" : "pending",
      owner: req.user._id,
    });

    res.status(201).json(formatTask(task));
  } catch (error) {
    next(error);
  }
});

app.put("/api/tasks/:id", authRequired, async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "admin" && task.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this task" });
    }

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      task.status = status === "completed" ? "completed" : "pending";
    }

    await task.save();

    res.json(formatTask(task));
  } catch (error) {
    next(error);
  }
});

app.delete(
  "/api/tasks/:id",
  authRequired,
  adminOnly,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      await task.deleteOne();

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  await connectDB();
  await seedInitialData();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
};

startServer();
