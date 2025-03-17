import React from 'react'
import Hero from '../components/Hero'
import LatestCollections from '../components/LatestCollections'
import BestSeller from '../components/BestSeller'
import { useEffect } from 'react'
import CategorySection from '../components/CategoryCard'
import WhatsAppChatWidget from '../components/WhatsappChatWidget'
import CouponDisplay from '../components/CouponDisplay'


const home = () => {

useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");
  
    if (savedPosition !== null) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition, 10),
            behavior: "instant",
          });
  
          // Delay clearing session storage after scroll restoration
          setTimeout(() => {
            sessionStorage.removeItem("scrollPosition");
          }, 1000);
        }, 200);
      });
    }
  }, []);

  return (
    <div>
      <CategorySection/>
      <CouponDisplay/>
      <Hero/>
     
      <WhatsAppChatWidget/>
      <LatestCollections/>
      <BestSeller/>
      
      
    </div>
  )
}

export default home
