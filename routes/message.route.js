const express = require("express");
const router = express.Router();
const controller = require("../controllers/message.controller");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, controller.sendMessage);
router.get("/:conversationId", auth, controller.getMessageByConversation);
module.exports = router;
