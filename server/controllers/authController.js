const User = require("../models/user");
const { hashedPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const test = (req, res) => {
  res.send("test");
};
// login endpoint
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "User not found!",
      });
    } else {
      console.log(user);
    }

    // Check if password match
    const match = await comparePassword(password, user.password);
    if (match) {
      res.json({msg:'login success'})
      jwt.sign(
        { email: user.email, id: user._id, name: user.name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    } else {
      res.json({ error: "Password does not match" });
    }
  } catch (error) {
    console.log(error);
  }
};
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if name was entered
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }

    // Check if password is good
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }

    // Check if email is valid
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken already",
      });
    }

    // Hash password
    const hashed = await hashedPassword(password);
    // Save user to db
    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

const getProfile = (req, res)=>{
  const {token} = req.cookies;
  if (token){
    jwt.verify(token,process.env.JWT_SECRET,{},(err, user)=>{
      if (err) throw err;
      res.json(user)
    })
  }else {
    res.json(null)
  }
}

module.exports = { test, register, login, getProfile };
