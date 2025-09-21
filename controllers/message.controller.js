const messageService = require("../services/message.service");

exports.sendMessage = async (req, res, next) => {
  try {
    const sender = req.user.userId;
    const { conversationId, text, media } = req.body;

    if (!conversationId || (!text && !media)) {
      return res.status(400).json({ message: "Thiếu nội dung gửi" });
    }

    const message = await messageService.create({
      conversationId,
      sender,
      text,
      media,
    });

    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

exports.getMessageByConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { beforeId, limit = 20 } = req.query;

    const message = await messageService.getByConversation(
      conversationId,
      beforeId,
      parseInt(limit)
    );
    res.json(message);
  } catch (err) {
    next(err);
  }
};
