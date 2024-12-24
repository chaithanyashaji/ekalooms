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
        try {
            const response = await axios.post(
                `${backendUrl}/api/user/refresh-token`,
                {},
                { withCredentials: true } // Use cookies
            );
            if (response.data.success) {
                const { newAccessToken } = response.data;
                setToken(newAccessToken);
                return newAccessToken;
            } else {
                throw new Error("Refresh token is invalid or expired");
            }
        } catch (error) {
            console.error("Error during refresh token process:", error.message);
            toast.error("Session expired. Please log in again.");
            logout(); // Gracefully log out the user
        }
    };

    // Retry Logic with Token Refresh
    const handleRequestWithRetry = async (apiCall, retryCount = 1) => {
        try {
            return await apiCall(); // Attempt the original API call
        } catch (error) {
            if (error.response?.status === 401 && retryCount > 0 && !isRefreshing) {
                setIsRefreshing(true);
                const newToken = await refreshToken();
                setIsRefreshing(false);
                if (newToken) {
                    return await handleRequestWithRetry(apiCall, retryCount - 1); // Retry the API call
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


const getUserCart = async () => {
    try {
        const accessToken = localStorage.getItem("token");
        

        if (!accessToken) {
            console.error("No access token found in localStorage.");
            return;
        }

        const response = await axios.post(
            `${backendUrl}/api/cart/get`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

      
        setCartItems(response.data.cartData || {});
        return response.data.cartData;
    } catch (error) {
        console.error("Error fetching user cart:", error.message);

        if (error.response && error.response.status === 401) {
            console.error("Access token expired. Refreshing...");
            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                return await getUserCart(); // Retry with new token
            } else {
                console.error("Failed to refresh token. Redirecting to login.");
                navigate("/login");
            }
        }
    }
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


const getProductsData = async (page = 1, limit = 20) => {
    try {
        const response = await axios.get(`${backendUrl}/api/product/list`, {
            params: { page, limit },
        });
        if (response.data.success) {
            setProducts(response.data.products);
            setPagination(response.data.pagination);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error("Error fetching products:", error.message);
        toast.error("Failed to fetch products.");
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