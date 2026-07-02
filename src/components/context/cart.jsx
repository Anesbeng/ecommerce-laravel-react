import { createContext } from "react";
import { useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cart")) || [],
  );
  const clearCart = () => {
    setCartItems([]); // updates React state → re-renders everywhere instantly
    localStorage.removeItem("cart"); // keep storage in sync too
  };
  const addToCart = (product, size = null, qty = 1) => {
    let updatedCart = [...cartItems];

    const existingIndex = updatedCart.findIndex(
      (item) => item.productId === product.id && item.size?.id === size?.id,
    );

    if (existingIndex !== -1) {
      // Add the selected qty on top of existing qty
      updatedCart[existingIndex].qty += qty;
    } else {
      updatedCart.push({
        id: `${product.id}-${Math.floor(Math.random() * 1000)}`,
        productId: product.id,
        title: product.title,
        price: product.price,
        qty: qty, // ← use qty here
        size: size,
        image_url: product.image_url,
      });
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  const subtotal = () => {
    return cartItems.reduce((item) => item.price * item.qty);
  };
  const finalTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  };
  const updateQty = (itemId, newQty) => {
    if (newQty < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, qty: newQty } : item,
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  return (
    <CartContext.Provider
      value={{
        addToCart,
        cartItems,
        removeFromCart,
        subtotal,
        finalTotal,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
