import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Package, 
  Truck, 
  Clock,
  DollarSign,
  Calendar,
  User,
  Phone,
  MapPin
} from 'lucide-react';

const baseUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
  processing: { color: 'bg-purple-100 text-purple-800', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-indigo-100 text-indigo-800', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelled' },
};

const paymentStatusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
  failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
};

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filters.status,
        search: filters.search,
        page: filters.page,
        limit: 10,
      });

      const response = await fetch(`${baseUrl}/api/orders/all?${params}`);
      const data = await response.json();
      
      setOrders(data.orders || []);
      setPagination({
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        total: data.total,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/orders/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, notes = '') => {
    try {
      setUpdating(true);
      const response = await fetch(`${baseUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus, notes }),
      });

      if (response.ok) {
        await fetchOrders();
        await fetchStats();
        setShowModal(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const getStatusIcon = (status) => {
    const Icon = statusConfig[status]?.icon || Clock;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(stats.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.statusStats?.find(s => s._id === 'pending')?.count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.statusStats?.find(s => s._id === 'delivered')?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by customer name, email, or phone..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="md:w-48">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.cartItems.length} item{order.cartItems.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.shippingInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.shippingInfo.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.shippingInfo.phone}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.cartItems.slice(0, 2).map((item, index) => (
                          <div key={index} className="truncate max-w-xs">
                            {item.name} × {item.qty}
                          </div>
                        ))}
                        {order.cartItems.length > 2 && (
                          <div className="text-gray-500">
                            +{order.cartItems.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(order.totalPrice)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[order.orderStatus]?.color}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-1">{statusConfig[order.orderStatus]?.label}</span>
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatusConfig[order.paymentInfo?.status]?.color}`}>
                        {paymentStatusConfig[order.paymentInfo?.status]?.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {pagination.currentPage} of {pagination.totalPages} 
                ({pagination.total} total orders)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                  disabled={filters.page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters({ ...filters, page: Math.min(pagination.totalPages, filters.page + 1) })}
                  disabled={filters.page === pagination.totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={updateOrderStatus}
          updating={updating}
        />
      )}
    </div>
  );
}

// Order Details Modal Component
function OrderDetailsModal({ order, onClose, onUpdateStatus, updating }) {
  const [newStatus, setNewStatus] = useState(order.orderStatus);
  const [notes, setNotes] = useState(order.notes || '');

  const handleStatusUpdate = () => {
    onUpdateStatus(order._id, newStatus, notes);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Order #{order._id.slice(-8).toUpperCase()}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Customer Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{order.shippingInfo.name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{order.shippingInfo.phone}</span>
                </div>
                <div className="text-gray-600">{order.shippingInfo.email}</div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <div>{order.shippingInfo.address}</div>
                    <div>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zip}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order Date:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">₹{order.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${paymentStatusConfig[order.paymentInfo?.status]?.color}`}>
                    {paymentStatusConfig[order.paymentInfo?.status]?.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">Qty: {item.qty}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{item.price * item.qty}</div>
                    <div className="text-sm text-gray-600">₹{item.price} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Update Order Status</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about this order..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || newStatus === order.orderStatus}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersList;
