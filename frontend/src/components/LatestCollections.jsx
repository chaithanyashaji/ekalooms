import React,{useContext,useEffect,useState} from 'react'
import { ShopContext } from '../context/shopcontext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollections = () => {


    const {products} = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0, 8));
      },
    [products])
    

 
    
  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST '} text2={'COLLECTIONS'}/>
       
      </div>

      {/*Rendering Products*/}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          latestProducts.map((item,index) => (
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} rating={item.averageRating||0} totalReviews={item.totalReviews} bestseller={item.bestseller} inStock={item.inStock}/>
          ))
        }

      </div>
    </div>
  )
}

export default LatestCollections
