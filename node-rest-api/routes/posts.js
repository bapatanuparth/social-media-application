const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body); //This creates a new JavaScript object that conforms to the Post Mongoose schema.
  try {
    const savePost = await newPost.save(); //saves a new document to the database or updates an existing one if the document already exists.
    res.status(200).json(savePost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your own posts");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your own posts");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like/dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      //if the likes array doesnt have the current user, then add the user to the likes for the post
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("the post has been liked");
    } else {
      //if the user is already liking the post, make it dislike
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("the post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    //friendPosts variable will be an array of arrays, where each inner array contains all the posts for a single friend.
    console.log(req.body.userId);
    const friendPosts = await Promise.all(
      //The Promise.all method is used to execute a collection of promises in parallel and wait for all of them to complete before proceeding.
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId }); //map method is used to create an array of promises that each return a Mongoose find query to search for all posts with a matching userId field value equal to the current friend's friendId.
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get user posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
