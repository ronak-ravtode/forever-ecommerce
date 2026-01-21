import User from "../models/user.model.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const createToken = (id) => {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET)
}
//Route for user login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email })

    if(!user){
        throw new ApiError(400, "User not found")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid email or password")
    }

    const token = createToken(user._id)

    if(!token){
        throw new ApiError(500, "Internal server error")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "User logged in successfully", { user, token }))
})

//Route for user register
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email })

    if (user) {
        throw new ApiError(400, "User already exists")
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid email")
    }
    if (password.length < 8) {
        throw new ApiError(400, "Please enter a strong password")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ name, email, password: hashedPassword })

    if(!newUser){
        throw new ApiError(500, "Internal server error")
    }

    const token = createToken(newUser._id)

    if(!token){
        throw new ApiError(500, "Internal server error")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "User registered successfully", { user: newUser, token }))
})

//Route for admin login
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if(!email || !password){
        throw new ApiError(400, "All fields are required")
    }

    if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
        throw new ApiError(400, "Invalid email or password")
    }

    const token = jwt.sign(email+password, process.env.JWT_SECRET)

    if(!token){
        throw new ApiError(500, "Internal server error")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Admin logged in successfully", { token }))
})

export { loginUser, registerUser, adminLogin }