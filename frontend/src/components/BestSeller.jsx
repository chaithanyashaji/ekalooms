import React, {useContext,useState,useEffect}from 'react'
import { ShopContext } from '../context/shopcontext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {

    const {products} = useContext(ShopContext)
    const [bestSeller,setBestSeller] = useState([]);

useEffect(() => {
    const bestProduct =products.filter((item)=> (item.bestseller));
    setBestSeller(bestProduct.slice(0,6));
},[products])

  return (
    <div className='mt-20 '>
        <hr/>
        <div className='text-center text-3xl py-10 '>
            <Title text1={'BEST '} text2={'SELLERS'}/>
            
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mb-8'>
            {
                bestSeller.map((item,index)=>(
                    <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} rating={item.averageRating||0 }
                    totalReviews={item.totalReviews} bestseller={item.bestseller} inStock={item.inStock} category={item.category}
                    subCategory={item.subCategory} sizes={item.sizes} stockQuantity={item.stockQuantity}/>
                ))
            }

        </div>

      <hr/>
    </div>
  )
}

export default BestSeller
