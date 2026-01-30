import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const adminAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
        throw new ApiError(401, "Unauthorized")
    }
    const token = authHeader;
    if (!token) {
        throw new ApiError(401, "Unauthorized")
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const expectedToken = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    if (decoded !== expectedToken) {
        console.log("Token mismatch:", decoded, "!=", expectedToken)
        throw new ApiError(401, "Unauthorized")
    }
    next()
})

export default adminAuth