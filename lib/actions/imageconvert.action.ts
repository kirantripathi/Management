"use server"
import {v2 as cloudinary} from "cloudinary"



cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUD_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUD_SECRET,
  })


  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
  
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
  
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };


export const  convertImage = async (file:File) => {
  const base64 = await toBase64(file as File) as string;
  console.log(base64,"in omage converted")
const uploadResponse = await cloudinary.uploader.upload(base64);
return uploadResponse.url;
}


