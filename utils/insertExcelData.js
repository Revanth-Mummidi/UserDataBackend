import MainUserModel from "../models/mainUserModel.js";
import UserModel from "../models/userModel.js";
import excelDateToJSDate from "./convertExcelDateToString.js";

export default async function insertExcelData(arr1,mainUserEmail) {
  var err = [];
  var arr = [];

  const mainUser = await MainUserModel.findOne({ email: mainUserEmail }).populate("usersData");
  if (!mainUser) {
    return res.status(404).json({
      message: "Main user not found",
    });
  }
  
  for (const userDetails of arr1) {
    try {
      
      console.log("User Details", userDetails);

      if(mainUser.usersData.find((user)=>user.email===userDetails.email)){
        err.push(userDetails.email);
        console.log("User already exists", userDetails.email, err);
        continue;
      }
    
      const newUser = {
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        email: userDetails.email,
        gender: userDetails.gender,
        dob: excelDateToJSDate(userDetails.dob),
        description: userDetails.description,
        type: userDetails.type,
      };
      arr.push(newUser);
      console.log("NEw User", newUser);
    const res= await UserModel.create(newUser);
    console.log("RES",res);
    mainUser.usersData.push(res._id);
      await mainUser.save();
    } catch (error) {
      console.log("Error in inserting user data", error);
    }
  }
  
  console.log("Error", err);
  console.log("Data", arr);
  return { data: arr, error: err };
}
