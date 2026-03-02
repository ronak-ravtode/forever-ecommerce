import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';
import ImageWithSkeleton from './ImageWithSkeleton';

const ProductItem = ({id,image,name,price}) => {
    const {currency} = useContext(ShopContext);
  return (
    <Link className='text-gray cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden'>
            <ImageWithSkeleton src={image[0]} className='w-full object-cover hover:scale-110 transition ease-in-out' skeletonClassName='w-full' alt="" />
        </div>
        <p className='pt-3 pb-1 text-sm'> {name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem