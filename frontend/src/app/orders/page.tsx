'use client';

import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import Link from 'next/link';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  Product?: {
    id: number;
    title: string;
    images: string[];
  };
}

interface Order {
  id: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalPrice: number;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingPhone?: string;
  orderNotes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingAddress: string;
  OrderItems: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(res.data))
      .catch((error) => {
        console.error('Error fetching orders:', error);
      })
      .finally(() => setLoading(false));
  }, []);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔧';
      case 'shipped': return '📦';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order is being reviewed';
      case 'processing': return 'Your order is being prepared';
      case 'shipped': return 'Your order is on its way';
      case 'delivered': return 'Your order has been delivered';
      case 'cancelled': return 'Your order has been cancelled';
      default: return 'Order status unknown';
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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You have no orders yet.</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg p-6 shadow-sm">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-600">
                    {formatDate(order.createdAt)}
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm text-blue-600 mt-1">
                      �� Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{order.totalPrice.toFixed(2)}</p>
                  <div className="flex space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status}
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

              {/* Order Status Progress */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Order Progress:</span>
                  <span className="text-sm text-gray-500">{getStatusDescription(order.status)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      order.status === 'pending' ? 'w-1/4 bg-yellow-500' :
                      order.status === 'processing' ? 'w-1/2 bg-blue-500' :
                      order.status === 'shipped' ? 'w-3/4 bg-purple-500' :
                      order.status === 'delivered' ? 'w-full bg-green-500' :
                      'w-0 bg-gray-500'
                    }`}
                  ></div>
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

              {/* Shipping Information */}
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

              {/* Order Notes */}
              {order.orderNotes && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-gray-800">Order Notes:</h4>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-700">{order.orderNotes}</p>
                  </div>
                </div>
              )}

              {/* Estimated Delivery */}
              {order.estimatedDelivery && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-gray-800">Estimated Delivery:</h4>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      📅 {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderDetails(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
                
                {order.status === 'delivered' && (
                  <Link
                    href={`/products/${order.OrderItems[0]?.Product?.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Buy Again
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
              {/* Order Summary */}
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
                    {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
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

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Name:</span> {selectedOrder.customerName || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {selectedOrder.customerEmail || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {selectedOrder.customerPhone || 'N/A'}
                  </div>
                  {selectedOrder.shippingPhone && selectedOrder.shippingPhone !== selectedOrder.customerPhone && (
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}