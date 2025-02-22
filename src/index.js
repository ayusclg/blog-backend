import express from 'express';
import { dbConnect } from './database/index.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js'
import dotenv from 'dotenv'
import cors from 'cors'
import postRoutes from './routes/post.routes.js'
import adminRoutes from './routes/admin.routes.js'



const app = express();
const port = 3000;
const hostName = '127.0.0.1';

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())

dbConnect()
.then((res)=>{
    app.listen(port, () => {
        console.log(`You're running on http://${hostName}:${port}`);
    });
    
})
.catch((err)=>{
    console.log("Error Occured In connecting database")
})


//routes

app.use("/auth",userRoutes)
app.use("/post",postRoutes)
app.use("/admin",adminRoutes)