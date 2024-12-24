import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-1 items-center mb-3">
      <p className="text-[#A75D5D] prata-regular">
        {text1}
        <span className="text-[#F0997D]  prata-regular">{text2}</span>
      </p>
      <p className="w-10 sm:w-12 h-[1px] sm:h-[2px] bg-gradient-to-r from-[#D3756B] to-[#FFC3A1]"></p>
    </div>
  );
};

export default Title;
