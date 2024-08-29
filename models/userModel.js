import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstname:{
        type:String,
        required:[true,"Please add the first name"]
    },
    lastname:{
        type:String,
        required:[true,"Please add the last name"]
    },
    gender:{
        type:String,
        required:[true,"Please add the gender"],
        enum:['Male','Female','Others']
    },
    description:{
        type:String,
        required:[true,"Please add the description"]
    },
    email:{
        type:String,
        required:[true,"Please add the contact email"],
        unique:[true,"Email address is already taken"]
    },
    dob:{
        type:String,
        required:[true,"Please add the date of birth"]
    },
    type:{
        type:String,
        required:[true,"Please add the type"],
        enum:['Employee','Worker','Labour']
    },  
},
{
    timestamps:true,
}
);

const UserModel= mongoose.model("User",userSchema);

export default UserModel;