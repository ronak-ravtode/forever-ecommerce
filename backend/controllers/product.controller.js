import Product from "../models/Product.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {v2 as cloudinary} from "cloudinary"

//add product
const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, subCategory, sizes, bestSeller } = req.body

    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0] 
    const image4 = req.files.image4 && req.files.image4[0]

    const images = [image1,image2,image3,image4].filter((image)=>image!==undefined)

    let imageUrls = await Promise.all(
        images.map(async(image)=>{
                let result = await cloudinary.uploader.upload(image.path,{resource_type:"image"})
                return result.secure_url
            })
    )

    const productData = {
        name,
        description,
        category,
        price:Number(price),
        image:imageUrls,
        subCategory,
        sizes:JSON.parse(sizes),
        bestSeller: bestSeller === "true" ? true : false,
        date:Date.now()
    }
    
    const product = await Product.create(productData)

    if(!product){
        throw new ApiError("Product not added",400)
    }

    return res.status(201).json(new ApiResponse(201,"Product added successfully",product))

})

//get all products
const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})
    if(!products){
        throw new ApiError("Products not found",404)
    }
    return res.status(200).json(new ApiResponse(200,"Products fetched successfully",products))
})

//remove product
const removeProduct = asyncHandler(async (req, res) => {
    const {id} = req.body

    if(!id){
        throw new ApiError("Product id is required",400)
    }
    
    const product = await Product.findByIdAndDelete(id)

    if(!product){
        throw new ApiError("Product not found",404)
    }
    return res.status(200).json(new ApiResponse(200,"Product removed successfully",product))
})

//single product
const singleProduct = asyncHandler(async (req, res) => {
    const {id} = req.body
    if(!id){
        throw new ApiError("Product id is required",400)
    }
    const product = await Product.findById(id)
    if(!product){
        throw new ApiError("Product not found",404)
    }
    return res.status(200).json(new ApiResponse(200,"Product fetched successfully",product))
})

export { addProduct, getAllProducts, removeProduct, singleProduct }