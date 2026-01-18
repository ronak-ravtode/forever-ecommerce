import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const adminAuth = asyncHandler(async (req, res, next) => {
    const token = req.headers.token;
    if(!token){
        throw new ApiError(401, "Unauthorized")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if(decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
        throw new ApiError(401, "Unauthorized")
    }
    next()
})

export default adminAuth