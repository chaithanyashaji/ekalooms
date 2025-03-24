import React from 'react';
import { Gift } from 'lucide-react';
import '../assets/MinimalistCouponDisplay.css';
 // Import external CSS file

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
      <div className="w-full border-t border-b border-[#65000B] overflow-hidden relative">
        <div className="flex animate-scroll">
          {[...Array(2)].map((_, repeatIndex) => (
            <div key={repeatIndex} className="flex gap-6 whitespace-nowrap">
              {Array.from({ length: 20 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 text-[#65000B] cursor-pointer hover:bg-[#FFF5F2] transition-colors"
                  onClick={() => handleCopyCode(coupon.code)}
                >
                  <Gift className="w-4 h-4 text-[#65000B]" />
                  <span className="text-xs font-medium">{coupon.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalistCouponDisplay;
