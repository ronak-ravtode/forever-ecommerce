import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
const PlaceOrder = () => {

  const [method, setMethod] = useState('cod')
  const { navigate, backend_url, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext)

  // Check if user is logged in and redirect if not
  React.useEffect(() => {
    if(!token){
      navigate('/login')
      toast.error('Please login first')
    }
  }, [token, navigate])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency:order.currency,
      name:"Order Payment",
      description:"Order Payment",
      order_id:order.id,
      receipt:order.receipt,
      handler: async (response) => {
        console.log(response)
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  } 

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmitHandler = async(e) => {
    e.preventDefault()
    try {

      let orderItems = []

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const productInfo = structuredClone(products.find((product) => product._id === productId))
            if(productInfo){
              productInfo.size = size
              productInfo.quantity = cartItems[productId][size]
              orderItems.push(productInfo)
            }
          }
        }
      }
      

    let orderData = {
      address:formData,
      items:orderItems,
      amount:getCartAmount() + delivery_fee,
    }
    switch(method){
      case 'cod':
        const response = await axios.post(`${backend_url}/api/order/place`,orderData,{
          headers:{Authorization:`Bearer ${token}`}
        })
        if(response.data.success){
          setCartItems({})
          navigate('/orders')
          toast.success(response.data.message)
        }
        else{
          toast.error(response.data.message)
        }
        break;
      case 'stripe':

      const responseStripe = await axios.post(`${backend_url}/api/order/stripe`,orderData,{
        headers:{Authorization:`Bearer ${token}`}
      })
      if(responseStripe.data.success){
        const {session_url} = responseStripe.data
        window.location.replace(session_url)
      }
      else{
        toast.error(responseStripe.data.message)
      }
        break;
      case 'razorpay':

        const responseRazorpay = await axios.post(`${backend_url}/api/order/razorpay`,orderData,{
          headers:{Authorization:`Bearer ${token}`}
        })
        if(responseRazorpay.data.success){
          // const {order_id} = responseRazorpay.data
          initPay(responseRazorpay.data.data)
        }

        break;
      default:
        break;
    }

    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl my-3 sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} value={formData.firstName} name='firstName' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} value={formData.lastName} name='lastName' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} value={formData.email} name='email' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} value={formData.street} name='street' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zip code' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} value={formData.phone} name='phone' className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone number' />
      </div>
      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* Payment Method Selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            {/* <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div> */}
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white text-sm px-16 py-3'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder