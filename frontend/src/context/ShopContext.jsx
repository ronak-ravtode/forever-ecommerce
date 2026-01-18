import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "$";
    const delivery_fee = 10;
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const navigate = useNavigate()

    const addToCart = async(itemId,size) => {

        if(!size){
            toast.error("Please select a size")
            return
        }
        
        let cartData = structuredClone(cartItems)

        if(cartData[itemId] && cartData[itemId][size]) {
            cartData[itemId][size] += 1
        } else if(cartData[itemId]) {
            cartData[itemId][size] = 1
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setCartItems(cartData)
    }
    const getCardCount = () => {
        let count = 0
        for(const productId in cartItems){
            for(const size in cartItems[productId]){
                count += cartItems[productId][size]
            }
        }
        return count
    }
    const updateQuantity = async(itemId,size,quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity
        setCartItems(cartData) 
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const productId in cartItems){
            let productInfo = products.find((product) => product._id === productId)
            for(const size in cartItems[productId]){
                totalAmount += cartItems[productId][size] * productInfo.price
            }
        }
        return totalAmount
    }

    const getProductsData = async() => {
        try {
            const response = await axios.get(`${backend_url}/api/product/all`) 
            if(response.data.success){
                setProducts(response.data.data)
                console.log(response.data.data)
            }
            else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    useEffect(() => {
        getProductsData()
    },[])
    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCardCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backend_url
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;