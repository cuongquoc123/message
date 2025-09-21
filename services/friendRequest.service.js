const FriendRequest = require("../models/friendRequest.model");
const User = require("../models/user.model");

exports.create = async (senderId, receiverId) => {
  if (senderId.toString() === receiverId.toString()) {
    throw new Error("Ban khong the ket ban voi chinh minh");
  }

  const existing = await FriendRequest.findOne({
    sender: senderId,
    receiver: receiverId,
    status: "pending",
  });
  if (existing) {
    throw new Error("Da gui loi moi ket ban truoc do");
  }

  const reverse = await FriendRequest.findOne({
    sender: receiverId,
    receiver: senderId,
    status: "pending",
  });
  if (reverse) {
    throw new Error("Nguoi dung nay da gui loi moi ket ban cho ban");
  }

  const request = await FriendRequest.create({
    sender: senderId,
    receiver: receiverId,
  });

  return {
    message: "Da gui loi moi ket ban",
    requestId: request._id,
  };
};

exports.acceptFriendRequest = async (requestId) => {
  const request = await FriendRequest.findById(requestId);

  if (!request || request.status !== "pending") {
    throw new Error("Loi moi ket ban khong ton tai hoac da duoc xu ly");
  }

  const { sender, receiver } = request;
  const userA = await User.findById(sender);
  const userB = await User.findById(receiver);

  if (!userA.friends.includes(userB._id)) {
    userA.friends.push(userB._id);
  }

  if (!userB.friends.includes(userA._id)) {
    userB.friends.push(userA._id);
  }

  await userA.save();
  await userB.save();

  request.status = "accepted";
  await request.save();

  return { message: "Da chap nhan loi moi ket ban" };
};

exports.rejectFriendRequest = async (requestId) => {
  const request = await FriendRequest.findById(requestId);

  if (!request || request.status !== "pending") {
    throw new Error("Loi moi ket ban khong ton tai hoac da duoc xu ly");
  }

  request.status = "rejected";
  await request.save();

  return { message: "Da tu choi loi moi ket ban" };
};

exports.getIncomingRequests = async (userId) => {
  return FriendRequest.find({
    receiver: userId,
    status: "pending",
  }).populate("sender", "username email fullName");
};

exports.getSentRquests = async (userId) => {
  return FriendRequest.find({
    sender: userId,
    status: "pending",
  }).populate("receiver", "username email fullName");
};
