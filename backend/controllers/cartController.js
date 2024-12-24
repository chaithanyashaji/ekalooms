
import userModel from "../models/userModel.js";


//add products to user cart

const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = user.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Item added to cart successfully!" });
    } catch (error) {
        console.error("Error adding to cart:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


//update user cart
const updateCart = async (req, res) => {
    try {
        const { itemId, size, quantity } = req.body;
        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = user.cartData || {};
        if (cartData[itemId]) {
            cartData[itemId][size] = quantity;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart updated successfully!" });
    } catch (error) {
        console.error("Error updating cart:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


//get user cart
const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        console.error("Error fetching cart:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


export {addToCart, updateCart, getUserCart}

