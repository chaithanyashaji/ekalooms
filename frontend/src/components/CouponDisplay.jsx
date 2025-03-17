import React from 'react';
import { Gift } from 'lucide-react';

const MinimalistCouponDisplay = () => {
  const coupon = {
    text: 'EKA10 - Get 10% Off on your first order',
    code: 'EKA10',
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Copied: ${code}`);
  };

  return (
    <div className="py-3">
      <div className="w-full border-t border-b border-[#A75D5D] overflow-hidden relative">
        <div className="flex animate-scroll">
          {/* Duplicating content for smooth infinite effect */}
          {[...Array(2)].map((_, repeatIndex) => (
            <div key={repeatIndex} className="flex gap-6 whitespace-nowrap">
              {Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 text-[#A75D5D] cursor-pointer hover:bg-[#FFF5F2] transition-colors"
                  onClick={() => handleCopyCode(coupon.code)}
                >
                  <Gift className="w-4 h-4 text-[#A75D5D]" />
                  <span className="text-xs font-medium">{coupon.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          display: flex;
          width: 200%; /* Ensures smooth infinite looping */
          animation: scroll 20s linear infinite; /* Slower, smoother loop */
        }
      `}</style>
    </div>
  );
};

export default MinimalistCouponDisplay;
