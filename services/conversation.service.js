const Conversation = require("../models/conversation.model");

exports.create = async ({ members, isGroup = false, name = "" }) => {
  if (!isGroup && members.length === 2) {
    const existing = await Conversation.findOne({
      isGroup: false,
      members: { $all: members, $size: 2 },
    });
    if (existing) return existing;
  }

  const conversation = new Conversation({ members, isGroup, name });
  return await conversation.save();
};

exports.getAllByUser = async (userId) => {
  return await Conversation.find({ members: userId })
    .populate("members", "username email")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });
};
