const router = require("express").Router(); //set up an express router
const User = require("../models/User");
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        //findByIdAndUpdate method accepts two arguments: the ID of the document to find and an object that specifies the updates to apply.
        $set: req.body, //The $set operator is used to set or update the values of fields in the document with the values from the request body.
        //The $set operator only modifies the fields specified in the request body, leaving any other fields unchanged.
      });

      res.status(200).json("Account updated");
    } catch (err) {
      console.log("not found user");
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});
//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    //check whether the user is trying to delete own accountor someone elses
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("Account Deleted successfully");
    } catch (err) {
      console.log("not found user");
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});
//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    //destructure the user returned by mongosse in 3 parts -> password, updatedAt and other
    //other collects the remaining fields except the first ones.
    //this way we send only the required information back to user and not the whole thing
    const { password, updatedAt, ...other } = user._doc; //The _doc property is a special property in Mongoose that contains the underlying JavaScript object representation of the document.
    res.status(200).json(other);
  } catch (err) {
    console.log("not found user");
    return res.status(500).json(err);
  }
});
//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId != req.params.id) {
    //check if users are same
    try {
      const user = await User.findById(req.params.id); //user to be followed
      const currentUser = await User.findById(req.body.userId); //requesting user

      if (!user.followers.includes(req.body.userId)) {
        //if current user doesnt follows user

        // The updateOne method is a built-in Mongoose method that allows updating a single document that matches a specified filter.
        await user.updateOne({ $push: { followers: req.body.userId } }); //The $push operator adds a new element to the end of an array field.
        await currentUser.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {}
  } else {
    return res.status(403).json("You cannot follow yourself");
  }
});
//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId != req.params.id) {
    //check if users are same
    try {
      const user = await User.findById(req.params.id); //user to be followed
      const currentUser = await User.findById(req.body.userId); //requesting user

      if (user.followers.includes(req.body.userId)) {
        //if current user already follows user

        // The updateOne method is a built-in Mongoose method that allows updating a single document that matches a specified filter.
        await user.updateOne({ $pull: { followers: req.body.userId } }); //The $pull operator removes all occurrences of a specified value from an array field.
        await currentUser.updateOne({
          $pull: { followings: req.params.id },
        });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you allready unfollow this user");
      }
    } catch (err) {}
  } else {
    return res.status(403).json("You cannot unfollow yourself");
  }
});

module.exports = router;
