const User = require("../models/user");
const Task = require("../models/task");

const seedInitialData = async () => {
  const adminEmail = "admin@example.com";
  const userEmail = "user@example.com";

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "Admin User",
      email: adminEmail,
      password: "admin123",
      role: "admin",
    });
    console.log("Seeded admin@example.com");
  }

  let demoUser = await User.findOne({ email: userEmail });
  if (!demoUser) {
    demoUser = await User.create({
      name: "Demo User",
      email: userEmail,
      password: "user123",
      role: "user",
    });
    console.log("Seeded user@example.com");
  }

  const taskCount = await Task.countDocuments();
  if (taskCount === 0) {
    await Task.insertMany([
      {
        title: "Draft product brief",
        description: "Outline the main goals for the new release",
        status: "pending",
        owner: admin._id,
      },
      {
        title: "Prepare sprint board",
        description: "Add tickets and estimates for sprint planning",
        status: "completed",
        owner: demoUser._id,
      },
    ]);
    console.log("Seeded sample tasks");
  }
};

module.exports = { seedInitialData };

