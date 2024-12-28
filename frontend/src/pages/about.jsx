import React from 'react';
import Title from '../components/Title';
import { AiOutlineHeart } from "react-icons/ai";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white border-2 border-[#A75D5D] rounded-lg shadow-xl p-8 md:p-12">
        <div className="text-center ">
          <Title text1={'ABOUT '} text2={'US'} />
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-1/3">
            <div className="rounded-lg overflow-hidden border-2 border-[#A75D5D] shadow-lg">
              <img
                className="w-full h-[300px] object-cover"
                src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222305/hero_img11_f61cul.jpg"
                alt="About Us"
                loading="lazy"
              />
            </div>
          </div>

          <div className="md:w-2/3 space-y-5 text-gray-600">
            <div className="pl-2 sm:pl-5">
              <p className="Outfit leading-relaxed pb-4 italic text-[#A75D5D]">Welcome to ekalooms,</p>
              <p className="Outfit leading-relaxed">
                We are a homegrown brand, rooted in our love for India's rich artistry and the unmatched skill of local artisans. 
                Every saree, suit and piece of decor we offer is carefully handpicked from different parts of India, bringing you 
                not just products but pieces of tradition wrapped in love and care.
              </p>
              <br />
              <p className="Outfit leading-relaxed">
                At Eka Looms, we understand that your wardrobe deserves pieces that are as effortless as they are beautiful. 
                That's why we focus on designs that drape with ease, fabrics that feel like a gentle embrace, and decor that brings warmth 
                to your space.
              </p>
              <br />
              <p className="Outfit leading-relaxed">
                Explore our collection today and rediscover the joy of owning pieces that feel as personal as they are beautiful.
              </p>
              <br />
              <p className="text-md text-left italic text-[#A75D5D]  pt-4 font-serif ">
                Happy Shopping! 
              </p>
              <p className="prata-regular text-md text-[#A75D5D] flex items-center">
  ekatribe <AiOutlineHeart className="ml-1" size={16} />
</p>

            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default About;
