import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backend_url, currency } from '../App'

const List = ({token}) => {

    const [list, setList] = useState([])

    const fetchList = async () => {
        try {
            const response = await axios.get(`${backend_url}/api/product/all`)
            if (response.data.success) {
                setList(response.data.data)
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const removeProduct = async(id) => {
        try {
         const response = await axios.delete(`${backend_url}/api/product/remove`,{data:{id},headers:{Authorization:token}})
         if(response.data.success){
            toast.success(response.data.message)
            await fetchList()
         }
         else{
            toast.error(response.data.message)
         }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        fetchList()
    }, [])

    return (
        <>
            <p className='mb-2'>All Products List</p>
            <div className='flex flex-col gap-2 '>
                {/* List Table */}

                <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b className='text-center'>Actions</b>
                </div>
                {/* Product list */}

                {
                    list.reverse().map((item,idx)=>(
                     <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 px-2 py-1 border text-sm' key={idx}>
                        <img className='w-12' src={item.image[0]} alt="" />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>{currency}{item.price}</p>
                        <p className='text-right md:text-center cursor-pointer text-lg' onClick={()=>removeProduct(item._id)}>X</p>
                     </div>   
                    ))
                }
            </div>
        </>
    )
}

export default List