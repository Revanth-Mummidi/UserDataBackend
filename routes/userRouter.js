import { Router } from "express";
import { createUser, deleteUser, getCategorizedData, getSplitData, getUsers, login, register, updateUser } from "../controllers/userController.js";
import validateToken from "../middlewares/validateToken.js";
const userRouter = Router();


userRouter.use(validateToken);
userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.post('/split', getSplitData);
userRouter.delete('/:id', deleteUser);
userRouter.put('/:id', updateUser);
userRouter.post('/getcategorizeddata',getCategorizedData);

userRouter.post('auth/login',login);
userRouter.post('auth/register',register);

export default userRouter;