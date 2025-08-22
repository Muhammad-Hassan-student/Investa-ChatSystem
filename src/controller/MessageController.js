import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
import messageModel from "../models/message.model.js";
import errorHandler from "../utils/errorHandler.js";
import { getReceiverSocketId, io } from "../lib/socket.io.js";

const sendMessage = async (req, res, next) => {
    try {
        //SENDER-ID IS MY ID
        const { id: receiverId, senderId } = req.params;
        console.log("Sender Id: ", senderId);
        const fileUrls = [];

        // Only process image files
        if (req.files) {
            const uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "messages/images/",
                            resource_type: "image",
                            quality: "auto",
                            fetch_format: "auto",
                        },
                        (error, result) => {
                            if (error) {
                                return reject(errorHandler(400, "Failed to upload image"));
                            }
                            fileUrls.push(result.secure_url);
                            resolve(result.secure_url);
                        }
                    );

                    const readStream = Readable.from(file.buffer);
                    readStream.pipe(stream);
                });
            });

            await Promise.all(uploadPromises);
        }

        const { text } = req.body;
        const newMessage = new messageModel({
            senderId,
            receiverId,
            text,
            files: fileUrls,
        });

        await newMessage.save();

        //TODO SOCEKT CONNECTED FORT LIVE TRACK MESSGAES
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            newMessage,
        });
    } catch (error) {
        console.error("Error in sendMessage", error);
        next(errorHandler(500, "Server error while sending message"));
    }
};


const getMessages = async (req, res, next) => {
    try {
        const { id: userToChatId, } = req.params;
        const myId = req.params.senderId;
        console.log(myId);

        const messages = await messageModel.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        next(errorHandler(500, "Server error while fetching messages"));
    }
}

const deleteMessages = async (req, res, next) => {
    try {
        const { senderId } = req.params;
        const message = await messageModel.findById(req.params.messageId);

        if (!message) {
            return next(errorHandler(403, "Message not found"));
        }

        if (message.senderId !== senderId) {
            return next(errorHandler(400, "You can only delete your own message"));

        }

        await messageModel.findByIdAndDelete(req.params.messageId);
        res.status(200).json({ message: "Message deleted successfully" });


    } catch (error) {
        console.log("Error in delete user ", error);
        next();
    }
}

export default {
    sendMessage,
    getMessages,
    deleteMessages
}