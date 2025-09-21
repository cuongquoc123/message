const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register
exports.register = async (req, res, next) => {
  try {
    const { username, fullName, email, password } = req.body;

    //Check if email exist
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email da ton tai" });
    }

    //Encode password
    const passwordHash = await bcrypt.hash(password, 10);

    //Create new user
    const user = await User.create({
      username,
      fullName,
      email,
      passwordHash,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Dang ky thanh cong",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Email khong ton tai" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) return res.status(400).json({ message: "Sai mat khau" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Dang nhap thanh cong",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};
