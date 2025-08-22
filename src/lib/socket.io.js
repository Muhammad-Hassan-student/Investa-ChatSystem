import express from "express"
import http from "http"
import {Server} from "socket.io"
 

//SECTION      =============================  INSTANCES  ==================================
const app = express();
export const server = http.createServer(app);
export  const io = new Server(server,{
    cors: {
        origin: ["http://localhost:8000"],
    }
});

const userSocketMap  = {};

//GET MESSAGES IN REAL TIME 
export const getReceiverSocketId  = (userId) => {
    return userSocketMap[userId];
}

io.on("connection",(socket) => {
    console.log("🟢 A user connected ", socket.id);

    const userId = socket.handshake.query.userId;
    if(!userId) userSocketMap[userId] = socket.id;

    socket.on("disconnected", () => { 
        console.log("🔴 A user is disconnected ",socket.id);
        delete userSocketMap[userId];

    });
});


