import express from "express"
import morgan from "morgan";
import colors from "colors"
import dotenv from "dotenv"
import connectDb from "./config/connect.db.js";
import connectCloudinary from "./config/cloudinary.config.js";
import messageRoute from "./routes/message.route.js"
import {server} from "./lib/socket.io.js";

const app =  express();


//APP CONFIG
dotenv.config()

//MIDDLER WARE
app.use(express.json());
app.use(morgan("dev"))

app.use("/api/message",messageRoute);


//LISTENING PORT
server.listen(5001,() => {
    console.log("server running successfully");
    connectDb();
}) 


const PORT = 5000;

app.listen(PORT, () => {
    connectDb()
    connectCloudinary()
    console.log(`Server is running on ${PORT} `.bgGreen.white);
});


//ERROR HANDLER MIDDLE WARE
app.use((err,req,res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
    })
})