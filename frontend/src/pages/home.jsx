import React from 'react'
import Hero from '../components/Hero'
import LatestCollections from '../components/LatestCollections'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import CategorySection from '../components/CategoryCard'
import WhatsAppChatWidget from '../components/WhatsappChatWidget'


const home = () => {
  return (
    <div>
      <CategorySection/>
      <Hero/>
      <WhatsAppChatWidget/>
      <LatestCollections/>
      <BestSeller/>
      
      
    </div>
  )
}

export default home
