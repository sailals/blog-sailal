const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");
// Update User-->

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateUser);
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    res.status(400).json("You can update only your account");
  }
});

// Delete User--->

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has successfully deleted");
      } catch (err) {}
    } catch (err) {
      res.status(404).json("User not found");
    }
  } else {
    res.status(400).json("You can delete only your account");
  }
});

module.exports = router;
