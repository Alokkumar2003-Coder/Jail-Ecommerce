'use client';

import { useEffect, useState } from 'react';
import api from '../../../utils/axios';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  Product?: {
    id: number;
    title: string;
    images: string[];
    price: number;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingPhone?: string;
  orderNotes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  User?: User;
  OrderItems?: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    api.get('/orders/all')
      .then((res) => {
        console.log('Orders data:', res.data);
        setOrders(res.data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        alert('Failed to fetch orders');
      })
      .finally(() => setLoading(false));
  }, []);

  const updateOrderStatus = async (orderId: number, status: string, paymentStatus?: string, trackingNumber?: string, estimatedDelivery?: string) => {
    try {
      const updateData: any = { status };
      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }
      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }
      if (estimatedDelivery) {
        updateData.estimatedDelivery = estimatedDelivery;
      }
      
      await api.put(`/orders/${orderId}`, updateData);
      setOrders(orders.map(order => 
        order.id === orderId ? { 
          ...order, 
          status,
          ...(paymentStatus && { paymentStatus }),
          ...(trackingNumber && { trackingNumber }),
          ...(estimatedDelivery && { estimatedDelivery })
        } : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border rounded-lg p-6 shadow-sm">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">
                  {order.customerName || order.User?.name || 'Customer'} 
                  ({order.customerEmail || order.User?.email || 'No email'})
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
                {order.customerPhone && (
                  <p className="text-sm text-gray-500">📞 {order.customerPhone}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">₹{order.totalPrice.toFixed(2)}</p>
                <div className="flex space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>
            </div>
            
            {/* Customer Details */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800">Customer Information:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {order.customerName || order.User?.name || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {order.customerEmail || order.User?.email || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {order.customerPhone || order.User?.phone || 'N/A'}
                </div>
                {order.shippingPhone && order.shippingPhone !== order.customerPhone && (
                  <div>
                    <span className="font-medium">Shipping Phone:</span> {order.shippingPhone}
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-800">Shipping Address:</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {(() => {
                    try {
                      const address = JSON.parse(order.shippingAddress);
                      return `${address.address || 'N/A'}, ${address.city || 'N/A'}, ${address.state || 'N/A'} ${address.zipCode || 'N/A'}, ${address.country || 'N/A'}`;
                    } catch (error) {
                      return 'Address not available';
                    }
                  })()}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-800">Order Items:</h4>
              <div className="space-y-2">
                {order.OrderItems && order.OrderItems.length > 0 ? (
                  order.OrderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        {item.Product?.images && item.Product.images.length > 0 && (
                          <img
                            src={item.Product.images[0]}
                            alt={item.Product.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <span className="font-medium">{item.Product?.title || 'Product not found'}</span>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items found</p>
                )}
              </div>
            </div>

            {/* Order Notes */}
            {order.orderNotes && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-800">Order Notes:</h4>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-700">{order.orderNotes}</p>
                </div>
              </div>
            )}

            {/* Tracking Information */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-800">Tracking Information:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={order.trackingNumber || ''}
                    onChange={(e) => updateOrderStatus(order.id, order.status, order.paymentStatus, e.target.value, order.estimatedDelivery)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tracking number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery
                  </label>
                  <input
                    type="date"
                    value={order.estimatedDelivery ? order.estimatedDelivery.split('T')[0] : ''}
                    onChange={(e) => updateOrderStatus(order.id, order.status, order.paymentStatus, order.trackingNumber, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Order Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                {order.paymentMethod === 'cod' && order.paymentStatus === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, order.status, 'paid')}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
              
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowOrderDetails(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Order #{selectedOrder.id} Details</h2>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Name:</span> {selectedOrder.customerName || selectedOrder.User?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {selectedOrder.customerEmail || selectedOrder.User?.email || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {selectedOrder.customerPhone || selectedOrder.User?.phone || 'N/A'}
                  </div>
                  {selectedOrder.shippingPhone && (
                    <div>
                      <span className="font-medium">Shipping Phone:</span> {selectedOrder.shippingPhone}
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    {(() => {
                      try {
                        const address = JSON.parse(selectedOrder.shippingAddress);
                        return `${address.address || 'N/A'}, ${address.city || 'N/A'}, ${address.state || 'N/A'} ${address.zipCode || 'N/A'}, ${address.country || 'N/A'}`;
                      } catch (error) {
                        return 'Address not available';
                      }
                    })()}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.OrderItems && selectedOrder.OrderItems.length > 0 ? (
                    selectedOrder.OrderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {item.Product?.images && item.Product.images.length > 0 && (
                            <img
                              src={item.Product.images[0]}
                              alt={item.Product.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.Product?.title || 'Product not found'}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm text-gray-600">Price: ₹{item.price?.toFixed(2) || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No items found</p>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.orderNotes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Notes</h3>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-gray-700">{selectedOrder.orderNotes}</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Order Date:</span> {formatDate(selectedOrder.createdAt)}
                    </div>
                    <div>
                      <span className="font-medium">Total Amount:</span> ₹{selectedOrder.totalPrice.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </div>
                    <div>
                      <span className="font-medium">Payment Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Order Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div>
                        <span className="font-medium">Tracking Number:</span> {selectedOrder.trackingNumber}
                      </div>
                    )}
                    {selectedOrder.estimatedDelivery && (
                      <div>
                        <span className="font-medium">Estimated Delivery:</span> {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}