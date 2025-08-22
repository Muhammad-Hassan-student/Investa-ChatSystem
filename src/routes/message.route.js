import express from "express"
import upload from "../middleware/multer.js";
import MessageController from "../controller/MessageController.js";

const router = express.Router();


router.get("/chats/:id/:senderId", MessageController.getMessages);
router.delete("/delete-message/:messageId/:senderId", MessageController.deleteMessages);


router.post(
  "/send/:id/:senderId",
  upload.array("files", 50),
  MessageController.sendMessage
);

export default router;