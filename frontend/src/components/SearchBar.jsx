import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'
import { useLocation } from 'react-router-dom'
import ImageWithSkeleton from './ImageWithSkeleton'

const SearchBar = () => {

    const {search,setSearch,showSearch,setShowSearch} = useContext(ShopContext)
    const [visible,setVisible] = useState(false)
    const location = useLocation();

    useEffect(()=>{
        if(location.pathname.includes('collection') ){
            setVisible(true)
        }
        else setVisible(false)
    },[location])

  return showSearch && visible ?(
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-400 rounded-full px-5 py-2 my-5 mx-3 w-3/4 sm:w-1/2 '>
            <input type="text" placeholder='Search' className='flex-1 outline-none bg-inherit text-sm' value={search} 
            onChange={(e)=>setSearch(e.target.value)} />
            <ImageWithSkeleton src={assets.search_icon} className='w-4' skeletonClassName='w-4 h-4' alt="" />
        </div>
        <ImageWithSkeleton src={assets.cross_icon} className='inline w-3 cursor-pointer' skeletonClassName='w-3 h-3 inline-block' onClick={()=>setShowSearch(false)} alt="" />
    </div>
  ) : null
}

export default SearchBar