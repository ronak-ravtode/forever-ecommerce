import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const adminAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token =
        req.headers.token ||
        (typeof authHeader === "string" && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader);

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