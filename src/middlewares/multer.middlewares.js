import multer from "multer";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        
            cb(null,'./public/images')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const fileFilter = (req,file,cb)=>{
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png"

    ]
    
        if(allowedMimeTypes.includes(file.mimetype)){
            cb(null,true)
        }
        else{
            cb(new Error("Only Images Files are allowed"),false)

        }
    }
    

export const Upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize: 5*1024*1024}
})