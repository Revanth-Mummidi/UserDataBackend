import express from 'express';
import cors from 'cors';
import connectDb from './config/databaseConfig.js';
import { configDotenv } from 'dotenv';
import userRouter from './routes/userRouter.js';
import bodyParser from 'body-parser';
import multer from 'multer';
import readXlsxFile from './utils/xlsx.js';
import insertExcelData from './utils/insertExcelData.js';

const App = express();
configDotenv();
connectDb();
App.use(bodyParser.json());
App.use(express.json());

App.use(express.urlencoded({ extended: true }));
App.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,`${file.originalname}`)
    }
})
const upload=multer({storage:storage});

App.post('/api/users/upload',upload.single('file'),async(req,res)=>{
    const file = req.file;
    console.log("Filename",file.filename);
    if(!file){
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    let arr1=readXlsxFile(file.filename);
    const result=await insertExcelData(arr1);
    // console.log("Result",result);
    if([...result.error].length>0){
        return res.status(400).json({"message":"Users already exists","data":result.error});
    }

    res.status(200).json({"message":'File uploaded successfully',"data":result.data});
})

App.use('/api/users', userRouter);


App.listen(3000, () => {     
    console.log('Server is running on port 3000');
});