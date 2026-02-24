const router = require("express").Router();
const messageController = require("../controllers/messageController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/messages", messageController.showMessages);
router.get("/messages/new", requireAuth, messageController.newMessageForm);
router.post("/messages/new", requireAuth, messageController.createMessage);

module.exports = router;