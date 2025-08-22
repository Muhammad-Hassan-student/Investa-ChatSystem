import mongoose from "mongoose";

const connectDb = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log(`MongoDb is connected on host ${mongoose.connection.host}`.bgYellow);
    }).catch((error) => {
        console.log("Error in mongoDb ", error)
    })
}

export default connectDb;