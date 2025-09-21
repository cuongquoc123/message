const express = require("express");
const router = express.Router();
const controller = require("../controllers/friendRequest.controller");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, controller.sendRequest);
router.patch("/:id/accept", auth, controller.acceptRequest);
router.patch("/:id/reject", auth, controller.rejectRequest);

router.get("/incoming", auth, controller.getIncomingRequests);
router.get("/sent", auth, controller.getSentRequests);
router.get("/friends", auth, controller.getFriends);

module.exports = router;
