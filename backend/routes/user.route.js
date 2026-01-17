import express from "express";

import {loginUser, registerUser, adminLogin} from "../controllers/user.controller.js";

const userRouter = express.Router();

//User routes
userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.post("/admin/login", adminLogin);

export default userRouter