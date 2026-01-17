import { createContext, useEffect, useState } from "react";
import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "$";
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({})

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
        getCardCount
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;