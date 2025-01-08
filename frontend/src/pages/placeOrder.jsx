import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/shopcontext';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
  const [method, setMethod] = useState('razorpay'); // Default to Razorpay
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, products } = useContext(ShopContext);
  const [isGuest, setIsGuest] = useState(!token);
  const [deliveryOption, setDeliveryOption] = useState('normal');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
 // Automatically set guest mode if no token
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const calculateDeliveryFee = () => {
    const cartAmount = getCartAmount();
    if (cartAmount > 1499) {
      return 0;
    }
    return deliveryOption === 'speedy' ? 95 : 60;
  };

  const applyCoupon = async () => {
    if (discountApplied) {
      toast.warning('Coupon already applied!');
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/api/coupon/validate`, { code: couponCode });
      if (response.data.success) {
        setDiscount(response.data.discount);
        setDiscountApplied(true);
        toast.success('Coupon applied successfully!');
      } else {
        toast.error(response.data.message);
        setDiscount(0);
      }
    } catch (error) {
     
      toast.error('Failed to apply coupon.');
    }
  };



  const initPay = (order, backendUrl, setCartItems, navigate) => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK failed to load. Please refresh the page.');
      return;
    }
  
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: 'Order Payment',
      description: 'Complete your order payment',
      order_id: order.id, // Razorpay order ID
      prefill: {
        email: order.address.email || '', // Prefill the user's email
      },
      handler: async (response) => {
        toast.info('Processing payment...');
  
        // Poll the backend to check for payment confirmation
        const pollPaymentStatus = async () => {
          try {
            const statusResponse = await axios.get(`${backendUrl}/api/order/status/${order.id}`);
  
            if (statusResponse.data.success && statusResponse.data.payment) {
              clearInterval(pollInterval);
              toast.success('Payment confirmed! 🎉');
              setCartItems({}) // Clear cart items
              navigate('/cart');
            } else {
              
            }
          } catch (error) {
            
            toast.error('Error verifying payment status.');
            clearInterval(pollInterval);
          }
        };
  
        const pollInterval = setInterval(pollPaymentStatus, 5000);
      },
      modal: {
        ondismiss: () => {
          toast.warning('Payment process was interrupted. Please try again.');
        },
      },
    };
  
    // Initialize Razorpay checkout
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.zipcode ||
      !formData.country ||
      !formData.phone
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const totalAmount = getCartAmount();
      const deliveryFee = calculateDeliveryFee();
      const discountedAmount = (totalAmount * discount) / 100
  
      let orderData = {
        address: formData,
        email: formData.email, // Pass only email
        items: orderItems,
        amount: totalAmount + deliveryFee - discountedAmount,
        deliveryOption,
        couponCode,

      };
  
      const headers = token? { Authorization: `Bearer ${token}` } : {};
  
     
if (method === 'razorpay') {
   const  response = await axios.post(
        backendUrl + (isGuest ? '/api/order/razorpayguest' : '/api/order/razorpay'),
        orderData,
        {
           headers
        }
    );


  
        if (response.data.success) {
         
          initPay(response.data.order, backendUrl, setCartItems, navigate);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      
      toast.error(error.message || 'An error occurred while placing the order');
    }
  };

  const subtotal = getCartAmount();
  const deliveryFee = calculateDeliveryFee();
  const discountAmount = (subtotal * discount) / 100;
  const finalAmount = subtotal + deliveryFee - discountAmount;

  
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email Address"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>
      {/* Right Side */}
      <div className="mt-8">
        {/* Right Side - Order Summary */}
      <div className="mt-8">
        {/* Coupon Section */}
        <Title text1={"APPLY "} text2={"COUPON"}/>
        <div className="bg-none p-4 rounded-md">
  {/* Input and Apply Button */}
  <div className="flex gap-2 items-center">
    <input
      type="text"
      placeholder="Discount code or gift card"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
      className="flex-grow border border-[#D3756B] rounded-md px-3 py-2 text-sm"
    />
    <button
      type="button"
      onClick={applyCoupon}
      className="bg-[#F0997D] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#D3756B]"
    >
      Apply
    </button>
  </div>

  {/* Display Applied Coupon */}
  {discountApplied && (
    <div className="flex items-center gap-1 mt-2 bg-none px-2 py-1 rounded-md text-sm text-[#A75D5D]">
      <span className="flex items-center gap-1">
      <i className="fas fa-tag text-[#A75D5D] text-sm"></i>
        {couponCode}
      </span>
      <button
        onClick={() => {
          setCouponCode('');
          setDiscount(0);
          setDiscountApplied(false);
          toast.info('Coupon removed!');
        }}
        className="text-[#A75D5D] hover:text-[#FFC3A1]"
      >
        <i className="fas fa-times text-[#A75D5D] text-sm"></i>
      </button>
    </div>
  )}

  
</div>



        {/* Delivery Options */}
        <div className="mt-8">
          <Title text1={'DELIVERY '} text2={'OPTIONS'} />
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-gray-500">
              <input
                type="radio"
                name="delivery"
                value="normal"
                checked={deliveryOption === 'normal'}
                onChange={() => setDeliveryOption('normal')}
              />
              Normal Delivery (5-7 Days) - INR 60
            </label>
            <label className="flex items-center gap-2 text-gray-500">
              <input
                type="radio"
                name="delivery"
                value="speedy"
                checked={deliveryOption === 'speedy'}
                onChange={() => setDeliveryOption('speedy')}
              />
              Speed Delivery (Within 2 Days) - INR 95
            </label>
            <p className="text-sm text-[#D3756B] italic text-center mt-2">  
             Shop above INR 1499 to avail free delivery. <i className="fas fa-shipping-fast text-[#D3756B]"></i> </p>

          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-6 bg-gray-50 p-6 rounded-lg">
          <Title text1="ORDER " text2="SUMMARY" />
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `₹${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount ({discount}%)</span>
                <span className="font-medium text-green-600">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-base font-semibold">Total</span>
                <span className="text-base font-semibold">₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>

            {subtotal > 1499 && (
              <div className="mt-2 text-sm text-green-600">
                You've qualified for free delivery!
              </div>
            )}
          </div>
        </div>

        {/* Place Order Button */}
        <div className="w-full text-center mt-8">
          <button 
            type="submit" 
            className="bg-gradient-to-r from-[#FFC3A1] to-[#D3756B] border-[#A75D5D] text-white rounded-md px-16 py-3 text-sm"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
      </div>
    </form>
  );
};


export default PlaceOrder;
