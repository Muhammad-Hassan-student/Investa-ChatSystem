import {v2 as cloudinary} from "cloudinary"

const connectCloudinary = async () => { 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});
console.log(process.env.CLOUDINARY_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log("Cloudianry is connected".bgMagenta);
}

export default connectCloudinary;