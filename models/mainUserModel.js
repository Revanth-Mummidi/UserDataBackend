import mongoose from "mongoose";

const mainUserSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please add the first name"]
    },
    password:{
        type:String,
        required:[true,"Please add the first name"]
    },
    email:{
        type:String,
        required:[true,"Please add the contact email"],
        unique:[true,"Email address is already taken"]
    }
},
{
    timestamps:true,
}
);

const MainUserModel= mongoose.model("MainUser",mainUserSchema);

export default MainUserModel;