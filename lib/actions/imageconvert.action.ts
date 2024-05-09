"use server"
import {v2 as cloudinary} from "cloudinary"



cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUD_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUD_SECRET,
  })


export const  convertImage = async (base64:any) => {
const uploadResponse = await cloudinary.uploader.upload(base64);
console.log(uploadResponse,"See the response")
return uploadResponse.url;
}


