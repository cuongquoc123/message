const express = require("express");
const router = express.Router();
const controller = require("../controllers/conversation.controller");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, controller.createConversation);
router.get("/", auth, controller.getConversations);

module.exports = router;
