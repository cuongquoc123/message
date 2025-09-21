const conversationService = require("../services/conversation.service");

exports.createConversation = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, isGroup = false, name = "" } = req.body || {};

    // validate đầu vào
    if (!receiverId || (Array.isArray(receiverId) && receiverId.length === 0)) {
      return res.status(400).json({ message: "Thiếu receiverId" });
    }

    const members = isGroup
      ? [senderId, ...receiverId]
      : [senderId, receiverId];

    const conversation = await conversationService.create({
      members,
      isGroup,
      name,
    });
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const conversation = await conversationService.getAllByUser(userId);
    res.json(conversation);
  } catch (err) {
    next(err);
  }
};
