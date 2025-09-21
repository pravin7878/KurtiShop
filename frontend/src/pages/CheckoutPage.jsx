// src/components/Checkout.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/ClerkProvider";
import { setUser } from "../app/slices/authSlice";
import { clearCart } from "../app/slices/cartSlice";
import AddressManager from "../components/AddressManager";

const baseUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000'

function Checkout() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isSignedIn, isLoaded } = useAuth();
  
  // Get items from cart or router state
  const routerStateItems = location.state || [];
  const itemsToCheckout = cartItems.length > 0 ? cartItems : routerStateItems;
  
  const totalPrice = itemsToCheckout.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/signin');
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Redirect if no items to checkout
  useEffect(() => {
    if (itemsToCheckout.length === 0) {
      navigate('/shop');
    }
  }, [itemsToCheckout, navigate]);

  // Update auth state when user changes
  useEffect(() => {
    if (user) {
      dispatch(setUser({
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        name: user.fullName || user.firstName,
      }));
      fetchAddresses();
    }
  }, [user, dispatch]);


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
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // Fetch user addresses
  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      // First, ensure user exists in database
      await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          name: user.fullName || user.firstName,
        }),
      });

      // Then fetch user data
      const response = await fetch(`${baseUrl}/api/users/${user.id}`);
      const userData = await response.json();
      setAddresses(userData.addresses || []);
      
      // Set default address if available
      const defaultAddress = userData.addresses?.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        setUseExistingAddress(true);
        setShippingInfo({
          name: defaultAddress.name,
          email: user?.emailAddresses?.[0]?.emailAddress || "",
          phone: defaultAddress.phone,
          address: defaultAddress.address,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zip: defaultAddress.zipCode,
        });
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Handle address selection
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setUseExistingAddress(true);
    setShippingInfo({
      name: address.name,
      email: user?.emailAddresses?.[0]?.emailAddress || "",
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zipCode,
    });
  };

  // Check if shipping info is complete
  const isShippingInfoComplete = () => {
    return shippingInfo.name && 
           shippingInfo.email && 
           shippingInfo.phone && 
           shippingInfo.address && 
           shippingInfo.city && 
           shippingInfo.state && 
           shippingInfo.zip;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Shipping Info:", shippingInfo);
    // Proceed to payment later
  };

  
  const rozorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID
  const rozorpayKeySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET

const handlePayment = async () => {
  // Validate shipping info
  if (!isShippingInfoComplete()) {
    alert("Please fill in all shipping information before proceeding to payment.");
    return;
  }

  try {
    const res = await fetch(`${baseUrl}/api/orders/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: totalPrice,
        userId: user?.id,
        cartItems: itemsToCheckout,
        shippingInfo: shippingInfo
      }),
    });

    const data = await res.json();

    const options = {
      key: rozorpayKeyId,
      amount: data.amount,
      currency: data.currency,
      name: "DUGGU FASHION",
      description: "E-commerce Purchase",
      order_id: data.id,
      handler: function (response) {
        // Clear the cart after successful payment (only if using cart items)
        if (cartItems.length > 0) {
          dispatch(clearCart());
        }
        
        alert("Payment successful! Your order has been placed.");
        console.log(response);
        navigate('/');
      },
      prefill: {
        name: shippingInfo.name || user?.fullName,
        email: shippingInfo.email || user?.emailAddresses?.[0]?.emailAddress,
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

          {/* Address Selection Options */}
          {addresses.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUseExistingAddress(true)}
                  className={`px-4 py-2 rounded-md ${
                    useExistingAddress 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Use Existing Address
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUseExistingAddress(false);
                    setSelectedAddress(null);
                    setShippingInfo({
                      name: "",
                      email: user?.emailAddresses?.[0]?.emailAddress || "",
                      phone: "",
                      address: "",
                      city: "",
                      state: "",
                      zip: "",
                    });
                  }}
                  className={`px-4 py-2 rounded-md ${
                    !useExistingAddress 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Add New Address
                </button>
              </div>

              {useExistingAddress && (
                <div className="mb-4">
                  <AddressManager 
                    onAddressSelect={handleAddressSelect}
                    selectedAddress={selectedAddress}
                    showSelection={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* Manual Address Form */}
          {!useExistingAddress && (
            <div>
              <h3 className="text-lg font-medium mb-4">Enter Shipping Details</h3>

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
            </div>
          )}

          <button
            onClick={handlePayment}
            type="button"
            disabled={!isShippingInfoComplete()}
            className={`mt-6 w-full font-semibold py-3 rounded-lg transition duration-300 ${
              isShippingInfoComplete()
                ? 'bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {isShippingInfoComplete() ? `Pay ₹${totalPrice}` : 'Complete Shipping Information'}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {itemsToCheckout.length > 0 ? (
              itemsToCheckout.map((item, index) => (
                <div
                  key={item._id || item.id || index}
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
              <p className="text-gray-500">No items to checkout.</p>
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
