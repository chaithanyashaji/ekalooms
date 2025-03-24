import React from 'react';

const Title = ({ text1, text2, level = 1 }) => {
  const HeadingTag = `h${level}`; // Dynamically determine the heading level

  return (
    <div className="inline-flex gap-1 items-center mb-3">
      <HeadingTag className="text-[#65000B] prata-regular">
        {text1}
        <span className="text-[#d1856c] prata-regular">{text2}</span>
      </HeadingTag>
      <span
        className="w-10 sm:w-12 h-[1px] sm:h-[2px] bg-gradient-to-r from-[#D3756B] to-[#FFC3A1]"
        role="separator"
        aria-hidden="true"
      ></span>
    </div>
  );
};

export default Title;
