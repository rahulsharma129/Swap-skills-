const express = require("express");
const adminRouter = express.Router();
const { userAuth, adminAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

// Reject inappropriate or spammy skill descriptions
adminRouter.patch("/admin/user/:id/skills/reject", userAuth, adminAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User not found");
  user.skills = [];
  await user.save();
  res.send({ message: "Skills rejected and cleared." });
});

// Ban user
adminRouter.patch("/admin/user/:id/ban", userAuth, adminAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User not found");
  user.banned = true;
  await user.save();
  res.send({ message: "User banned." });
});

// Unban user
adminRouter.patch("/admin/user/:id/unban", userAuth, adminAuth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User not found");
  user.banned = false;
  await user.save();
  res.send({ message: "User unbanned." });
});

// Monitor swaps (pending, accepted, cancelled)
adminRouter.get("/admin/swaps", userAuth, adminAuth, async (req, res) => {
  const swaps = await ConnectionRequest.find();
  res.send(swaps);
});

// Send platform-wide message (for demo, just echo)
adminRouter.post("/admin/message", userAuth, adminAuth, async (req, res) => {
  res.send({ message: "Message sent to all users", data: req.body });
});

// Download user report
adminRouter.get("/admin/report/users", userAuth, adminAuth, async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// Download swap report
adminRouter.get("/admin/report/swaps", userAuth, adminAuth, async (req, res) => {
  const swaps = await ConnectionRequest.find();
  res.send(swaps);
});

module.exports = adminRouter;