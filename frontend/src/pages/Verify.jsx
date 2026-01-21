import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const Verify = () => {
    const {navigate,token,setCartItems,backend_url} = useContext(ShopContext)
    const [searchParams,setSearchParams] = useSearchParams()

    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")

    const verifyPayment = async() => {
        try {
            if(!token) return null

            const response = await axios.post(`${backend_url}/api/order/verifyStripe`,{
                orderId,
                success,
                userId:token
            },{
                headers:{Authorization:`Bearer ${token}`}
            })
            if(response.data.success){
                toast.success(response.data.message)
                setCartItems({})
                navigate('/orders')
            }
            else{
                toast.error(response.data.message)
                navigate("/cart")
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message)            
        }
    }
    useEffect(() => {
        verifyPayment()
    },[token])
  return (
    <div>

    </div>
  )
}

export default Verify