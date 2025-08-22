import mongoose from "mongoose";

const  messageSchema = new mongoose.Schema({
    senderId : {type: String, required: true},
    receiverId: {type: String, required: true},
    text: {type: String, },
    files: { type: Array, default: [] },
},{timestamps: true});

const Message = mongoose.models.Message || mongoose.model("Message",messageSchema);
export default Message;