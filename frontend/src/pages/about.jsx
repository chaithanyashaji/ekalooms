import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import Newsletter from '../components/Newsletter';

const About = () => {
  return (
    <div>
      <div className="text-3xl text-center pt-8 border-t">
        <Title text1={'ABOUT '} text2={'US'} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16 justify-center items-center px-6">
        <img className="w-full md:max-w-[300px] max-h-[370px] rounded-lg object-cover" src={assets.hero_img11} alt="About Us" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 text-left">
          <p className="Outfit">
            We’re a homegrown brand, rooted in our love for India’s rich artistry and the unmatched skill of local artisans.
            Every saree, suit, and piece of home decor we offer is carefully handpicked from different parts of India, bringing you
            not just products but pieces of tradition wrapped in love and care.
          </p>
          <p className="Outfit">
            At Eka Looms, we understand that your wardrobe and home deserve pieces that are as effortless as they are beautiful.
            That’s why we focus on designs that drape with ease, fabrics that feel like a gentle embrace, and decor that brings warmth
            to your space.
          </p>
          <p className="Outfit">
            Explore our collection today and rediscover the joy of owning pieces that feel as personal as they are beautiful.
          </p>
          <p className="prata-regular   Outfit text-lg text-left">
            Eka Looms—Where craft meets comfort, & every thread tells a story
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
