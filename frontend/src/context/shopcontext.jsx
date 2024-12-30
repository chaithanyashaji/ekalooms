import { createContext,useEffect,useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export const ShopContext = createContext();

const ShopContextProvider =(props) => {

    const currency= 'INR ';
    const delivery_fee = 10;
    const backendUrl =import.meta.env.VITE_BACKEND_URL
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState('false');
    const [cartItems, setCartItems] = useState({});
    
    const [products, setProducts] = useState([]);
    const [token,setToken] = useState('');
    const [wishlist, setWishlist] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pagination, setPagination] = useState({
        totalProducts: 0,
        currentPage: 1,
        totalPages: 0,
      });
      const navigate =useNavigate();


      const refreshToken = async () => {
        // Prevent multiple refresh requests
        if (isRefreshing) {
            return null; // Skip if a refresh is already in progress
        }
    
        setIsRefreshing(true); // Set refreshing state to true
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/refresh-token`,
                {},
                { withCredentials: true }
            );
    
            if (response.data.success) {
                const { accessToken } = response.data;
    
                // Save the new access token
                setToken(accessToken);
                localStorage.setItem("token", accessToken);
    
                return accessToken;
            } else {
                throw new Error("Refresh token is invalid or expired");
            }
        } catch (error) {
            console.error("Error during refresh token process:", error.message);
            toast.error("Session expired. Please log in again.");
            logout(); // Log out the user if refresh fails
            return null;
        } finally {
            setIsRefreshing(false); // Reset refreshing state
        }
    };
    
    
    

    // Retry Logic with Token Refresh
    const handleRequestWithRetry = async (apiCall, retryCount = 1) => {
        try {
            return await apiCall(); // Attempt the original API call
        } catch (error) {
            if (error.response?.status === 401 && retryCount > 0) {
                // Wait for any ongoing refresh process to complete
                if (isRefreshing) {
                    await new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if (!isRefreshing) {
                                clearInterval(interval);
                                resolve();
                            }
                        }, 100); // Check every 100ms
                    });
                }
    
                // Retry with a refreshed token
                const newToken = await refreshToken();
                if (newToken) {
                    return await handleRequestWithRetry(apiCall, retryCount - 1);
                }
            }
            throw error; // Rethrow the error if not recoverable
        }
    };
    
    
    // Logout Function
    const logout = () => {
        setToken(null);
        setCartItems({});
        setWishlist([]);
        localStorage.removeItem("token");
        navigate("/login");
    };


    const addToCart = async (itemId, size) => {
        if (!itemId) {
            toast.error("Invalid product ID.");
            return;
        }

        let cartData = structuredClone(cartItems);
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }
        cartData[itemId][size || "default"] = (cartData[itemId][size || "default"] || 0) + 1;

        setCartItems(cartData);

        if (token) {
            try {
                const response = await handleRequestWithRetry(() =>
                    axios.post(
                        `${backendUrl}/api/cart/add`,
                        { itemId, size: size || null },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                );
                if (response.data.success) {
                    toast.success("Item added to cart successfully!");
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error("Error adding item to cart:", error.message);
                toast.error("Failed to add item to cart.");
            }
        }
    };

   const getCartCount = () =>{
     let totalCount=0;
     for (const items in cartItems){
        for (const item in cartItems[items]){
            try{
                if(cartItems[items][item]>0){
                    totalCount+= cartItems[items][item];
                }
            } catch(e){
                console.log(e)
                toast.error(error.message)
        }
     }
   }
   return totalCount;
}

const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/update`,
                { itemId, size, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Cart updated successfully!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating cart:", error.message);
            toast.error("Failed to update cart.");
        }
    }
};


let cartFetchPromise = null; // A promise to manage concurrent calls to getUserCart

const getUserCart = async () => {
    // If a cart fetch is already in progress, return the existing promise
    if (cartFetchPromise) {
        return cartFetchPromise;
    }

    // Create a new promise for the ongoing fetch
    cartFetchPromise = (async () => {
        try {
            const accessToken = localStorage.getItem("token");

            if (!accessToken) {
                console.error("No access token found in localStorage.");
                return;
            }

            // Fetch cart data from the backend
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.data.success) {
                setCartItems(response.data.cartData || {});
                return response.data.cartData;
            } else {
                console.error("Failed to fetch cart data:", response.data.message);
                toast.error("Failed to fetch cart data.");
            }
        } catch (error) {
            console.error("Error fetching user cart:", error.message);

            // Handle token expiration and refresh
            if (error.response && error.response.status === 401) {
                console.error("Access token expired. Attempting token refresh...");
                const newAccessToken = await refreshToken();

                if (newAccessToken) {
                    // Retry fetching the cart after refreshing the token
                    return await getUserCart();
                } else {
                    console.error("Failed to refresh token. Redirecting to login.");
                    navigate("/login");
                }
            } else {
                toast.error("Failed to fetch cart data. Please try again.");
            }
        } finally {
            cartFetchPromise = null; // Reset the promise after the fetch completes
        }
    })();

    return cartFetchPromise;
};





const getCartAmount = () =>{
    let totalAmount=0;
    for (const items in cartItems){
        let itemInfo = products.find((product)=>product._id ===items);
        for (const item in cartItems[items]){
            try{
                if(cartItems[items][item]>0){
                    totalAmount+= itemInfo.price*cartItems[items][item];
                }
            } catch(e){
        }
     }
   }
   return totalAmount;
}


const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
  
      if (response.data.success) {
        const { products } = response.data;
        setProducts(products);
      } else {
        toast.error(response.data.message || "Failed to fetch products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
  
      if (error.response) {
        // API responded with an error
        toast.error(error.response.data.message || "Failed to fetch products.");
      } else {
        // Network or other errors
        toast.error("Unable to connect to the server. Please try again.");
      }
    }
  };
  
  

  

   
const fetchWishlist = async () => {
    if (!token) {
        toast.error("Please log in to access your wishlist.");
        navigate("/login");
        return;
    }
    try {
        const response = await handleRequestWithRetry(() =>
            axios.get(`${backendUrl}/api/user/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            })
        );
        if (response.data.success) {
            setWishlist(response.data.wishlist);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error("Error fetching wishlist:", error.message);
    }
};


const addToWishlist = async (productId) => {
    await handleRequestWithRetry(async () => {
        const response = await axios.post(
            `${backendUrl}/api/user/wishlist/add`,
            { productId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
            fetchWishlist();
        }
    });
};

const removeFromWishlist = async (productId) => {
    await handleRequestWithRetry(async () => {
        const response = await axios.post(
            `${backendUrl}/api/user/wishlist/remove`,
            { productId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
            fetchWishlist();
        }
    });
};

// Fetch wishlist when the token is available
useEffect(() => {
    if (token) {
        fetchWishlist();
        localStorage.setItem('token', token); // Ensure token is stored in localStorage
    }
}, [token]);

// Load products data once when the component mounts
useEffect(() => {
    getProductsData();
}, []);

// Load token from localStorage and fetch cart data if token exists


useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        setToken(storedToken);
        getUserCart(); // Fetch cart data after token is set
    }
}, []);




    const value ={
        products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    fetchWishlist,
    removeFromWishlist,
    addToWishlist,
    wishlist,
    refreshToken,
    pagination, 

    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;