import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/shopcontext';
import ProductItem from '../components/ProductItem'; // Reusable component for product items
import Title from '../components/Title'; // Title component

const Wishlist = () => {
    const { fetchWishlist, wishlist } = useContext(ShopContext);

    useEffect(() => {
        fetchWishlist(); // Fetch wishlist when the component mounts
    }, []);

    if (!wishlist || wishlist.length === 0) {
        return <p className="text-center text-gray-500 mt-5">Your wishlist is empty!</p>;
    }

    return (
        <div className="p-4">
            <div className="text-xl mb-6 text-center">
                <Title text1="MY " text2="WISHLIST" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                {wishlist.map((product) => (
                    <ProductItem
                        key={product._id}
                        id={product._id}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        rating={product.averageRating || 0}
                        totalReviews={product.totalReviews}
                        bestseller={product.bestseller}
                        inStock={product.inStock}
                    />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
