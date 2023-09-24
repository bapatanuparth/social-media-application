const router = require("express").Router(); //set up an express router
const User = require("../models/User");
const bcrypt = require("bcrypt"); //encrypt password before storing to database

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10); //salt generates random extra bytes as additional input to password hashing function
    //salt factor controls the complexity of the hash, but higher salt also increases the time required to generate and check hash values.
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create user with hashed password
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    //check if user found with entered email
    //fetch user with entered email if present in system
    const user = await User.findOne({ email: req.body.email }); //findOne is used because there is only one unique user
    !user && res.status(404).json("user not found");
    //compare the requested password with password fromm database
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
