import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
import fs from 'fs'



dotenv.config('./env')

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    


    const uploadingOnCloudinary = async function(localFilePath){
        try {
            if(!localFilePath) return null
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            // console.log('successfully uploaded',response.url)
            fs.unlinkSync(localFilePath)
            return response
            
        } catch (error) {
            fs.unlinkSync(localFilePath)
            console.log('error occured in Uploading',error)
            return null
            
        }
    }
    export {uploadingOnCloudinary}