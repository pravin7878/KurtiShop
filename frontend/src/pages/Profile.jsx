import { useState, useEffect } from "react";
import { useAuth } from "../providers/ClerkProvider";
import { useSelector } from "react-redux";
import AddressManager from "../components/AddressManager";

const baseUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';

function Profile() {
  const { user, isSignedIn, isLoaded } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserOrders();
    }
  }, [isSignedIn, user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/orders/user/${user.id}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
          <a href="/signin" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 px-6 py-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {user?.firstName?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-white">
                  {user?.fullName || user?.firstName || 'User'}
                </h1>
                <p className="text-indigo-200">{user?.emailAddresses?.[0]?.emailAddress}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Orders
              </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'addresses'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Addresses
            </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                {loading ? (
                  <div className="text-center py-8">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg mb-4">No orders found</p>
                    <a href="/shop" className="text-indigo-600 hover:text-indigo-700">
                      Start shopping
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold">Order #{order._id.slice(-8)}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.totalPrice}</p>
                            <p className={`text-sm ${
                              order.orderStatus !== 'Pending' 
                                ? 'text-green-600' 
                                : 'text-yellow-600'
                            }`}>
                              {order.orderStatus || 'Pending'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {order.cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x {item.qty}</span>
                              <span>₹{item.price * item.qty}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            <strong>Shipping to:</strong> {order.shippingInfo?.name}, {order.shippingInfo?.city}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.fullName || user?.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member since</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Manage Addresses</h2>
                <AddressManager />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
