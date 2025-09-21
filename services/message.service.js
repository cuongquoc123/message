const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");
const mongoose = require("mongoose");

exports.create = async ({ conversationId, sender, text, media }) => {
  const message = await Message.create({
    conversationId,
    sender,
    text,
    media,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
  });

  return message;
};

exports.getByConversation = async (conversationId, beforeId, limit = 20) => {
  const query = { conversationId };

  if (beforeId && mongoose.Types.ObjectId.isValid(beforeId)) {
    query._id = { $lt: beforeId };
  }

  const message = await Message.find({ conversationId })
    .populate("sender", "username email")
    .sort({ _id: -1 })
    .limit(limit);

  return message.reverse();
};
