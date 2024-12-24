import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/shopcontext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={'YOUR '} text2={'CART'} />
      </div>
      {cartData.length === 0 ? ( // Check if cartData is empty
        <div className="text-center py-20 text-[#A75D5D] text-lg">
          <p>Your cart is empty :(</p>
          <button
            onClick={() => navigate('/collection')} // Navigate to the shop or products page
            className="mt-5 px-6 py-2 bg-gradient-to-r from-[#F0997D] to-[#D3756B] text-white rounded-md hover:from-[#FFC3A1] hover:to-[#A75D5D]"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div>
          {cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            return (
              <div
                key={index}
                className="py-4 border-t border-b text-[#9D4A54] grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img className="w-16 sm:w-20" src={productData.image[0]} alt={productData.name} />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">{productData.name}</p>
                    <div className="flex items-center gap-5 mt-2">
                      <p className="text-[#A75D5D]">{currency}{productData.price}</p>
                      {productData.sizes && productData.sizes.length > 0 && (
                        <p className="px-2 rounded-md sm:px-3 sm:py-1 border-[#F0997D] bg-[#e7deda] text-gray-800">
                          {item.size}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <input
                  onChange={(e) =>
                    e.target.value === '' || e.target.value === '0'
                      ? null
                      : updateQuantity(item._id, item.size, Number(e.target.value))
                  }
                  className="border rounded-md max-w-10 max-h-10 mt-4 text-center sm:max-w-20 px-1 sm:px-2 py-1 text-gray-800"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="w-4 mr-4 sm:w-5 mt-6 ml-2 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Remove"
                />
              </div>
            );
          })}
          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              <div className="w-full text-end">
                <button
                  onClick={() => navigate('/place-order')}
                  className="rounded-md bg-gradient-to-r from-[#F0997D] to-[#D3756B] text-white text-sm my-8 py-3 px-3 hover:from-[#FFC3A1] hover:to-[#A75D5D]"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
