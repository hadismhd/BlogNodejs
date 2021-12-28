const express = require('express');
const router = express.Router();
const User = require("../model/user");
const bcrypt = require('bcrypt')

// REGISTER
router.post('/register', async (req, res) => {
  try {
    // make password hash
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass
    })

    const user = await newUser.save()
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try { 
    // LOOKING FOR USER NAME
    const user = await User.findOne({ username: req.body.username })
    !user && res.status(400).json('wrong credentials!')
    // compare entered password with the hash one that is stored in DB
    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
})
  module.exports = router;