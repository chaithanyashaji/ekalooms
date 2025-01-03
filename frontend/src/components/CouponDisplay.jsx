import React from 'react';
import { Tag, Gift, Sparkles } from 'lucide-react';

const CouponDisplay = () => {
  const coupons = [
    {
      text: 'ekatribe10 - Get 10% Off',
      active: true,
      icon: Gift,
      code: 'ekatribe10',
    },
  ];

  const activeCoupons = coupons.filter((coupon) => coupon.active);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Copied: ${code}`);
  };

  return (
    <div className="pb-4 pt-2"> {/* Add padding here */}
      <div className="w-full p-1 bg-gradient-to-r from-[#D3756B] to-[#e8948b] shadow-md rounded-sm overflow-hidden">
        <div className="relative flex overflow-hidden">
          {/* Continuous scrolling wrapper */}
          <div
            className="flex gap-4 whitespace-nowrap animate-scroll"
            style={{
              animation: 'scroll 6s linear infinite',
            }}
          >
            {/* Duplicate the single coupon multiple times */}
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-white cursor-pointer group hover:scale-105 transition-transform duration-100"
                onClick={() => handleCopyCode(activeCoupons[0].code)}
              >
                <div className="bg-white/10 p-1 rounded-full group-hover:bg-white/20 transition-colors">
                  {/* Render the icon dynamically */}
                  {React.createElement(activeCoupons[0].icon, { className: 'w-3 h-3' })}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[10px]">{activeCoupons[0].text}</span>
                  <span className="text-[4px] opacity-80 group-hover:opacity-100 transition-opacity">
                    Click to copy: {activeCoupons[0].code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          display: flex;
          width: calc(200%); /* Double width to hold duplicated items */
        }
      `}</style>
    </div>
  );
};

export default CouponDisplay;

