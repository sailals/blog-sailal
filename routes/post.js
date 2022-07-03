const router = require("express").Router();
const Post = require("../models/Post");

// Create a Post-->

router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const insert = await newPost.save();
    res.status(200).json(insert);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Post-->

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.username === post.username) {
      try {
        const update = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(update);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete a Post-->

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Post deleted successfully");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a Post-->

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Post-->   /
//Get All Post os a Particular user-->  posts/?user=username
//Gate All Post according to category--> posts/?cat=category

router.get("/", async (req, res) => {
  const username = req.query.user;
  const cat = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (cat) {
      posts = await Post.find({
        categories: {
          $in: [cat],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
