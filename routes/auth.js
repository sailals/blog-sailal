const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register or singin-->

router.post("/signin", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
    });

    const insert = await newUser.save();
    res.status(200).json(insert);
  } catch (err) {
    res.status(500).json(err);
  }
});

//  Login-->
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.json("Wrong Credentials");
    }

    const passwordVal = await bcrypt.compare(req.body.password, user.password);

    if (!passwordVal) {
      return res.json("Wrong Credentials");
    }

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
