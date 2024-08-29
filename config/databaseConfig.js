import mongoose from 'mongoose';

const connectDb=async()=>{
    try{
        console.log("DATABASE CONNECTED",process.env.MONGO_CONNECTION_STRING );
        const connect = await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log("DATABASE CONNECTED with string");
    }
    catch(err){
        console.log("Error in connecting db",err);
        process.exit(1);
    }
}

export default connectDb;
