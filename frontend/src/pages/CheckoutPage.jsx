// src/components/Checkout.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BACKEND_URI

function Checkout() {
  const cartItems = useSelector((state) => state.cart.cartItems);
const location = useLocation()
const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );


console.log(totalPrice);




  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Shipping Info:", shippingInfo);
    // Proceed to payment later
  };

  
  const rozorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID
  const rozorpayKeySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET

const handlePayment = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/orders/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalPrice }),
    });

    const data = await res.json();

    const options = {
      key: rozorpayKeyId,
      amount: data.amount,
      currency: data.currency,
      name: "My Shop",
      description: "Test Transaction",
      order_id: data.id,
      handler: function (response) {
        alert("Payment successful!");
        console.log(response);
        // Here you can call another API to save order + payment info in DB
      },
      prefill: {
        name: shippingInfo.name,
        email: shippingInfo.email,
        contact: shippingInfo.phone,
      },
      theme: {
        color: "#6366f1", // indigo
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.error("Payment failed", err);
  }
};





  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 md:p-10 mt-6 md:mt-16">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8">
        {/* Shipping Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md flex-1"
        >
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={shippingInfo.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={shippingInfo.email}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={shippingInfo.phone}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={shippingInfo.zip}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={shippingInfo.address}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 col-span-1 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingInfo.city}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={shippingInfo.state}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
          onClick={handlePayment}
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 cursor-pointer rounded-lg hover:bg-indigo-700 transition duration-300"
          >
           Pay ₹{totalPrice}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b border-gray-200 pb-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.qty}
                    </p>
                  </div>

                  <p className="font-semibold">₹{item.price * item.qty}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Your cart is empty.</p>
            )}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
