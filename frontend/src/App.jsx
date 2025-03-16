import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Collection from './pages/collection';
import About from './pages/about';
import Contact from './pages/contact';
import Product from './pages/Product';
import Cart from './pages/cart';
import Login from './pages/login';
import PlaceOrder from './pages/placeOrder';
import Orders from './pages/orders';
import Verify from './pages/verify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Wishlist from './pages/wishlist';
import SearchBar from './components/SearchBar';
import BottomNavbar from './components/BottomNavbar';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TrackYourOrder from './pages/TrackyourOrder';
import Policy from './pages/policy';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "./components/Spinner";
import OrderDetails from "./pages/OrderDetails";

const App = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true); // Set loading to true when location changes
    const timer = setTimeout(() => setLoading(false), 500); // Simulate loading time
    return () => clearTimeout(timer); // Clear the timeout on unmount or location change
  }, [location]);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <BottomNavbar />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/collection' element={<Collection />} />
            <Route path="/collection/:categorySlug" element={<Collection />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Login />} />
            <Route path='/place-order' element={<PlaceOrder />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path='/trackyourOrder' element={<TrackYourOrder />} />
            <Route path='/policy' element={<Policy />} />
            <Route path="/order-details/:orderId" element={<OrderDetails />} />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
