import UserModel from "../models/userModel.js";
import excelDateToJSDate from "./convertExcelDateToString.js";

export default async function insertExcelData(arr1) {
  var err = [];
  var arr = [];

  for (const userDetails of arr1) {
    try {
      console.log("User Details", userDetails);
      const user = await UserModel.findOne({ email: userDetails.email });

      if (user) {
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
      console.log("New User", newUser);
      await UserModel.create(newUser);
    } catch (error) {
      console.log("Error in inserting user data", error);
    }
  }

  console.log("Error", err);
  console.log("Data", arr);
  return { data: arr, error: err };
}
