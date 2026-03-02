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
    const [token, setToken] = useState('')
    const navigate = useNavigate()

    const isJwtExpired = (jwtToken) => {
        if (!jwtToken) return true
        const parts = jwtToken.split('.')
        if (parts.length !== 3) return true
        try {
            const payload = JSON.parse(atob(parts[1]))
            if (!payload?.exp) return false
            return payload.exp * 1000 < Date.now()
        } catch (e) {
            return true
        }
    }

    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error("Please select a size")
            return
        }

        let cartData = structuredClone(cartItems)

        if (cartData[itemId] && cartData[itemId][size]) {
            cartData[itemId][size] += 1
        } else if (cartData[itemId]) {
            cartData[itemId][size] = 1
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(`${backend_url}/api/cart/add`, { userId: localStorage.getItem('userId'), itemId, size }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message || error.message)
            }
        }
    }
    const getCardCount = () => {
        let count = 0
        for (const productId in cartItems) {
            for (const size in cartItems[productId]) {
                count += cartItems[productId][size]
            }
        }
        return count
    }
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(`${backend_url}/api/cart/update`, { 
                    userId: localStorage.getItem('userId'), 
                    itemId, 
                    size, 
                    quantity 
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message || error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const productId in cartItems) {
            let productInfo = products.find((product) => product._id === productId)
            if (!productInfo) continue;
            for (const size in cartItems[productId]) {
                totalAmount += cartItems[productId][size] * productInfo.price
            }
        }
        return totalAmount
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/product/all`)
            if (response.data.success) {
                setProducts(response.data.data)
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async () => {
        try {
            const response = await axios.post(`${backend_url}/api/cart/get`, { userId: localStorage.getItem('userId') }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response.data.success) {
                setCartItems(response.data.data)
            }
        } catch (error) {
            console.log(error.response?.data?.message || error.message)
            toast.error(error.response?.data?.message || error.message)
        }
    }
    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            const storedToken = localStorage.getItem('token');
            if (isJwtExpired(storedToken)) {
                localStorage.removeItem('token')
                localStorage.removeItem('userId')
                setToken('')
                setCartItems({})
            } else {
                setToken(storedToken);
            }
        }
    }, [])

    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 401) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('userId')
                    setToken('')
                    setCartItems({})
                    navigate('/login')
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axios.interceptors.response.eject(interceptorId)
        }
    }, [navigate])

    useEffect(() => {
        if (token) {
            getUserCart();
        }
    }, [token])
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
        setCartItems,
        navigate,
        backend_url,
        token,
        setToken
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;