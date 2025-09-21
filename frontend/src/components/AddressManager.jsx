import { useState, useEffect } from 'react';
import { useAuth } from '../providers/ClerkProvider';

const baseUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';

function AddressManager({ onAddressSelect, selectedAddress, showSelection = false }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      console.log('Fetching addresses for user:', user.id);
      console.log('Backend URL:', baseUrl);
      
      // First, ensure user exists in database
      const createResponse = await fetch(`${baseUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.emailAddresses?.[0]?.emailAddress,
          name: user.fullName || user.firstName,
        }),
      });
      
      if (!createResponse.ok) {
        throw new Error(`Failed to create user: ${createResponse.status}`);
      }
      
      console.log('User created/found successfully');

      // Then fetch user data
      const response = await fetch(`${baseUrl}/api/users/${user.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log('User data fetched:', userData);
      setAddresses(userData.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAddress 
        ? `${baseUrl}/api/users/${user.id}/addresses/${editingAddress._id}`
        : `${baseUrl}/api/users/${user.id}/addresses`;
      
      const method = editingAddress ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAddresses();
        setShowForm(false);
        setEditingAddress(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await fetch(`${baseUrl}/api/users/${user.id}/addresses/${addressId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchAddresses();
        }
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await fetch(`${baseUrl}/api/users/${user.id}/addresses/${addressId}/default`, {
        method: 'PATCH',
      });

      if (response.ok) {
        await fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false,
    });
  };

  const handleAddressSelect = (address) => {
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading addresses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Address List */}
      {addresses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Addresses</h3>
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`p-4 border rounded-lg ${
                selectedAddress?._id === address._id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="font-medium">{address.name}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-sm text-gray-600">
                    {address.address}, {address.city}, {address.state} {address.zipCode}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {showSelection && (
                    <button
                      onClick={() => handleAddressSelect(address)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {selectedAddress?._id === address._id ? 'Selected' : 'Select'}
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Address Form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Set as default address
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {editingAddress ? 'Update Address' : 'Add Address'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                  resetForm();
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Address Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition"
        >
          + Add New Address
        </button>
      )}
    </div>
  );
}

export default AddressManager;
