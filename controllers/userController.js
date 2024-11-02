import MainUserModel from "../models/mainUserModel.js";
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const getUsers = async (req, res) => {
    try {
        const users = await MainUserModel.findOne({ email: req.email }).populate('usersData');
        console.log('Users', users);
        res.status(200).json({
            message: "Users fetched successfully",
            data: users.usersData
        });
    }
    catch (err) {
        console.log("Error in getting users", err);
        res.status(400).json({
            message: "Error in getting users"
        });
    }
}

export const getCategorizedData = async (req, res) => {
    try {
        const type = req.body.type;
        const { pageNumber, pageSize } = req.body;
        console.log('Type', type);
        console.log('Page number', pageNumber);
        console.log('Page size', pageSize);
        let categorizedData;

        // const categorizedData = await userModel.find({type:type}).skip((pageNumber-1)*pageSize).limit(pageSize);
        if (type === "Al") {
            const mainUser = await MainUserModel.findOne({ email: req.email }).populate('usersData');
            categorizedData = mainUser.usersData;
        } else {
            const mainUser = await MainUserModel.findOne({ email: req.email }).populate('usersData');
            const userIds = mainUser.usersData.map(user => user._id);

            categorizedData = await userModel.aggregate([
                { $match: { _id: { $in: userIds }, type: type } }
            ]);
        }
        if (categorizedData.length === 0) {
            return res.status(200).json({
                message: "No users found",
                data: []
            });
        }


        res.status(200).json({
            message: "Users fetched in categorized successfully",
            data: categorizedData
        });
    }
    catch (err) {
        console.log("Error in getting users in categorized", err);
    }
}

export const getSplitData = async (req, res) => {
    try {
        const { pageNumber, pageSize } = req.body;
        const users = await userModel.find().skip((pageNumber - 1) * pageSize).limit(pageSize);
        console.log('Body', req.body);
        console.log('Page number', pageNumber);
        console.log('Page size', pageSize);
        console.log('Length of users', [...users].length);
        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found"
            });
        }

        res.status(200).json({
            message: "Users fetched in split successfully",
            data: users
        });
    }
    catch (err) {
        console.log("Error in getting users with pagination", err);
    }
}

export const createUser = async (req, res) => {
    try {
        const userDetails = req.body;
        const check = await userModel.findOne({ email: userDetails.email });
        if (check) {
            return res.status(400).json({
                message: "User already existed"
            });
        }
        const newUser = new userModel(userDetails);
        await newUser.save();
        const mainUserEmail = req.email;
        const mainUser = await MainUserModel.findOne({ email: mainUserEmail });
        if (!mainUser) {
            return res.status(404).json({
                message: "Main user not found"
            });
        }

        mainUser.usersData.push(newUser._id);
        await mainUser.save();

        return res.status(201).json({
            message: "User created and linked successfully",
            data: newUser
        });
    }
    catch (err) {
        console.log("Error in creating user", err);
    }
}

export const deleteUser = async (req, res) => {
    try {
        const email = req.email;
        const mainUser = await MainUserModel.findOne({ email: email });
        if (!mainUser) {
            return res.status(404).json({
                message: "Main user not found"
            });
        }
        const id = req.params.id;
        const user = await userModel.findById(id);
        console.log("Before Main User", mainUser);

        mainUser.usersData = mainUser.usersData.filter((userId) => userId !== id);

        console.log("USER ID", id);
        console.log("MAIN USER", mainUser.usersData);

        await mainUser.save();
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await userModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "User deleted successfully"
        });
    }
    catch (err) {
        console.log("Error in deleting user", err);
    }
}

export const updateUser = async (req, res) => {
    try {

        const id = req.params.id;
        const userDetails = req.body;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const newUser = await userModel.findByIdAndUpdate(id, {
            ...userDetails
        }, {
            new: true
        });
        res.status(200).json({
            message: "User updated successfully",
            data: newUser
        });
    }
    catch (err) {
        console.log("Error in updating user", err);
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const user = await MainUserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const isSame = await bcrypt.compare(password, user.password);
        if (!isSame) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        res.status(200).json({
            message: "User logged in successfully",
            data: user,
            token: token
        });
    }
    catch (err) {
        console.log("Error in logging in user", err);
    }
}

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const token = await jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const user = await MainUserModel.findOne({ email: email });
        if (user) {
            return res.status(404).json({
                message: "User Already Existed!",
                user: user
            });
        }
        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = await MainUserModel.create({
            username: username,
            email: email,
            password: hashedpassword
        });

        res.status(200).json({
            message: "User registered in successfully",
            data: newUser,
            token: token
        });
    }
    catch (err) {
        console.log("Error in registered in user", err);
    }
}