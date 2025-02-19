import express from 'express';
import { dbConnect } from './database/index.js';
import cookieParser from 'cookie-parser';
const app = express();
const port = 3000;
const hostName = '127.0.0.1';


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

