import React from 'react'
import Hero from '../components/Hero'
import LatestCollections from '../components/LatestCollections'
import BestSeller from '../components/BestSeller'

import CategorySection from '../components/CategoryCard'
import WhatsAppChatWidget from '../components/WhatsappChatWidget'
import CouponDisplay from '../components/CouponDisplay'


const home = () => {
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
