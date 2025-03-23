import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/shopcontext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (!products || products.length === 0) return; // Wait for products to be ready
  
    const cachedBestsellers = sessionStorage.getItem('bestSellers');
  
    // Don't use cached data if it's empty
    if (cachedBestsellers) {
      const parsed = JSON.parse(cachedBestsellers);
      if (parsed.length > 0) {
        setBestSeller(parsed);
        return;
      }
    }
  
    const bestProduct = products.filter((item) => item.bestseller);
  
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
  
    const categories = ['Saree', 'Readymades', 'Dress materials', 'Home Decor'];
    const selected = [];
    const selectedIds = new Set();
  
    categories.forEach((cat) => {
      const itemsInCategory = bestProduct.filter((item) => item.category === cat);
      const shuffled = shuffleArray(itemsInCategory);
      const chosen = shuffled.slice(0, 2);
      chosen.forEach((item) => {
        if (!selectedIds.has(item._id)) {
          selected.push(item);
          selectedIds.add(item._id);
        }
      });
    });
  
    if (selected.length < 8) {
      const remaining = bestProduct.filter((item) => !selectedIds.has(item._id));
      const shuffledRemaining = shuffleArray(remaining);
  
      for (let i = 0; i < shuffledRemaining.length && selected.length < 8; i++) {
        selected.push(shuffledRemaining[i]);
        selectedIds.add(shuffledRemaining[i]._id);
      }
    }
  
    const finalSelection = shuffleArray(selected.slice(0, 8));
  
    sessionStorage.setItem('bestSellers', JSON.stringify(finalSelection));
    setBestSeller(finalSelection);
  }, [products]);
  
  useEffect(() => {
    if (performance.navigation.type === 1) {
      const cached = sessionStorage.getItem("bestSellers");
      if (cached && JSON.parse(cached).length === 0) {
        sessionStorage.removeItem("bestSellers");
      }
    }
  }, []);
  
  
  return (
    <div className='mt-20'>
      <hr />
      <div className='text-center text-3xl py-10'>
        <Title text1={'BEST '} text2={'SELLERS'} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mb-8'>
        {
          bestSeller.length > 0 ? (
            bestSeller.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
                rating={item.averageRating || 0}
                totalReviews={item.totalReviews}
                bestseller={item.bestseller}
                inStock={item.inStock}
                category={item.category}
                subCategory={item.subCategory}
                sizes={item.sizes}
                stockQuantity={item.stockQuantity}
              />
            ))
          ) : (
            <div className='col-span-full text-center text-gray-500'>
              No bestsellers available at the moment.
            </div>
          )
        }
      </div>

      <hr />
    </div>
  );
};

export default BestSeller;
