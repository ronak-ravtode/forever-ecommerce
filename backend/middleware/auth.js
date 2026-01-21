import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authUser = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') && !authHeader.startsWith('bearer ')) {
        return next(new ApiError(401, "Unauthorized"));
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return next(new ApiError(401, "Unauthorized"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    req.body.userId = decoded.userId;
    next();
});

export default authUser;