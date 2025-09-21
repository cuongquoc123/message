let User = require("../models/user.model");

exports.create = (userData) => {
  return User.create(userData);
};

exports.findByEmail = (email) => {
  return User.findOne({ email });
};

exports.findById = (id) => {
  return User.findById(id);
};

exports.getAllUser = () => {
  return User.find().select("-passwordHash");
};

exports.searchUserByUsername = (keyword) => {
  const regex = new RegExp(keyword, "i");
  return User.find({ username: regex }).select("-passwordHash");
};

exports.getFriendsOfUser = (userId) => {
  return User.findById(userId)
    .populate("friends", "username email fullName")
    .select("friends");
};
