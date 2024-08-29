import userModel from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try{
        const users = await userModel.find();
        res.status(200).json({
            message:"Users fetched successfully",
            data:users
        });
  }
  catch(err){
      console.log("Error in getting users",err);
  }
}

export const getCategorizedData = async (req, res) => {
    try{
          const type= req.body.type;
          const {pageNumber,pageSize}=req.body;
            console.log('Type',type);
            console.log('Page number',pageNumber);
            console.log('Page size',pageSize);
            let categorizedData;

            // const categorizedData = await userModel.find({type:type}).skip((pageNumber-1)*pageSize).limit(pageSize);
            if(type=="Al"){
                 categorizedData = await userModel.find();
            }
            else{
                 categorizedData = await userModel.find({type:type});  
            }
            if(categorizedData.length===0){
                return res.status(200).json({
                    message:"No users found",
                    data:[]
                });
            }
            

          res.status(200).json({
              message:"Users fetched in categorized successfully",
              data:categorizedData
          });
    }
    catch(err){
        console.log("Error in getting users in categorized",err);
    }
}

export const getSplitData = async (req, res) => {
    try{
          const {pageNumber,pageSize}=req.body;
           const users = await userModel.find().skip((pageNumber-1)*pageSize).limit(pageSize);
           console.log('Body',req.body);
           console.log('Page number',pageNumber);
              console.log('Page size',pageSize);   
           console.log('Length of users',[...users].length);
          if(users.length===0){
                return res.status(404).json({
                    message:"No users found"
                });
            }

          res.status(200).json({
              message:"Users fetched in split successfully",
              data:users
          });
    }
    catch(err){
        console.log("Error in getting users with pagination",err);
    }
  }

export const createUser = async (req, res) => {
   try{
       const userDetails=req.body;
        const email = userDetails.email;
        const user = await userModel.findOne({ email: email });
        if(user){
            return res.status(400).json({
                message:"User already exists"
            });
        }
        const newuser= await userModel.create({
            ...userDetails
        });
        res.status(201).json({
            message:"User created successfully",
            data:newuser
        });
   }
   catch(err){
       console.log("Error in creating user",err);
   }
}

export const deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await userModel.findById(id);
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        await userModel.findByIdAndDelete(id);
        res.status(200).json({
            message:"User deleted successfully"
        });
    }
    catch(err){
        console.log("Error in deleting user",err);
    }
}

export const updateUser = async (req, res) => {
    try{
        const id = req.params.id;
        const userDetails=req.body;
        const user = await userModel.findById(id);
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        const newUser = await userModel.findByIdAndUpdate(id,{
            ...userDetails
        },{
            new:true
        });
        res.status(200).json({
            message:"User updated successfully",
            data:newUser
        });
    }
    catch(err){
        console.log("Error in updating user",err);
    }
}

