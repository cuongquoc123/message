const friendRequestService = require("../services/friendRequest.service");
const userService = require("../services/user.service");

exports.sendRequest = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { receiverId } = req.body;

    const result = await friendRequestService.create(senderId, receiverId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.acceptRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await friendRequestService.acceptFriendRequest(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.rejectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await friendRequestService.rejectFriendRequest(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getIncomingRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const incoming = await friendRequestService.getIncomingRequests(userId);
    res.json(incoming);
  } catch (err) {
    next(err);
  }
};

exports.getSentRequests = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const sent = await friendRequestService.getSentRequests(userId);
    res.json(sent);
  } catch (err) {
    next(err);
  }
};

exports.getFriends = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getFriendsOfUser(userId);
    res.json(user.friends);
  } catch (err) {
    next(err);
  }
};
