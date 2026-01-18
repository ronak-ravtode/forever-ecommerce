import React from 'react'
import { useState } from 'react'
import { backend_url } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = ({setToken}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = async(e) => {
        try {
            e.preventDefault()
            const response = await axios.post(backend_url + '/api/user/admin/login', {email, password})
            
            if(!response.data.success){
                toast.error(response.data.message)
            }
            setToken(response.data.token)
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                        <input className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@email.com' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                        <input className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button className='rounded-md w-full px-4 py-2 mt-2 text-white bg-black ' type='submit'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login