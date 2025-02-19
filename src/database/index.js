import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()
export const dbConnect = async function(){
    try {
        const mongoInstance = await mongoose.connect(`${process.env.MONGODB_URI }`)
        console.log("MongoDb Connected Successfully !! ",mongoInstance.connection.host)
    } catch (error) {
        console.log("error occured in connecting database")
        process.exit(1)
    }
}