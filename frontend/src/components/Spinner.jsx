import React from 'react';
import { Heart, ShoppingCart, Truck, Check, Shirt, Gift, Star, User } from 'lucide-react';

const Spinner = () => {
  const iconPositions = [
    { angle: 0, component: Heart, color: "#F0997D" },
    { angle: 45, component: ShoppingCart, color: "#FFC3A1" },
    { angle: 90, component: Truck, color: "#D3756B" },
    { angle: 135, component: Check, color: "#65000B" },
    { angle: 180, component: Shirt, color: "#F0997D" },
    { angle: 225, component: Gift, color: "#FFC3A1" },
    { angle: 270, component: Star, color: "#D3756B" },
    { angle: 315, component: User, color: "#65000B" }
  ];

  const radius = 20; 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-none">
      <div className="relative w-12 h-12 animate-spin"> {/* Reduced size and using default spin animation */}
        {iconPositions.map(({ angle, component: IconComponent, color }, index) => {
          const radian = (angle * Math.PI) / 180;
          const x = radius * Math.cos(radian);
          const y = radius * Math.sin(radian);
          
          return (
            <IconComponent
              key={index}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                left: '50%',
                top: '50%',
                marginLeft: '-6px', 
                marginTop: '-6px'   
              }}
              size={12} 
              color={color}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Spinner;