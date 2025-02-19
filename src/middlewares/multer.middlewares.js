import multer from "multer";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.fieldname === "avatar"){
            cb(null,'public/images')
        }
        else if(file.fieldname ==="cv"){
            cb(null,'public/cvs')
        }
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const fileFilter = (req,file,cb)=>{
    if(file.fieldname ==='photo'){
        if(['image/png','image/jpeg'].includes(file.mimetype)){
            cb(null,true)
        }
        else{
            cb(new Error("Only Images Files are allowed"),false)

        }
    }
    if(file.fieldname === 'cvs'){
        if(file.mimetype ===  'application/pdf'){
            cb(null,true)
        }
        else{
            cb(new Error("Only pdf files are allowed"),false)
        }
    }
}
export const Upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize: 5*1024*1024}
})