import React, { useContext } from 'react';
import { ShopContext } from '../context/shopcontext';
import Title from './Title';

const CartTotal = () => {
  const { currency, getCartAmount, deliveryOption, discount = 0 } = useContext(ShopContext);

  const calculateDeliveryFee = () => {
    const cartAmount = Number(getCartAmount() || 0);
    if (cartAmount > 1499) {
      return 0; // Free delivery for orders > 1499
    }
    return deliveryOption === 'speedy' ? 150 : 210;
  };

  const calculateDiscount = () => {
    const subtotal = Number(getCartAmount() || 0);
    const discountPercent = Number(discount || 0);
    return (subtotal * discountPercent) / 100;
  };

  const calculateTotal = () => {
    const subtotal = Number(getCartAmount() || 0);
    const deliveryFee = 150.00;
    const discountAmount = Number(calculateDiscount() || 0);
    return subtotal + deliveryFee - discountAmount;
  };

  // Ensure we have valid numbers for display
  const subtotal = Number(getCartAmount() || 0).toFixed(2);
  const deliveryFee = 150.00;

  const discountAmount = Number(calculateDiscount() || 0).toFixed(2);
  const total = Number(calculateTotal() || 0).toFixed(2);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={'CART '} text2={'TOTALS'} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}
            {subtotal}
          </p>
        </div>
        <hr />

        {/* Discount */}
        {Number(discount) > 0 && (
          <>
            <div className="flex justify-between text-green-500">
              <p>Discount ({discount}%)</p>
              <p>-{currency}{discountAmount}</p>
            </div>
            <hr />
          </>
        )}

        {/* Shipping Fee */}
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            
          {currency}{deliveryFee}
          </p>
        </div>
        <hr />

        {/* Total */}
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {total}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;