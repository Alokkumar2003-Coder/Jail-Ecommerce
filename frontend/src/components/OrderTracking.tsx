'use client';

import { useState } from 'react';
import api from '../utils/axios';

interface OrderTrackingProps {
  orderId?: string;
  onClose?: () => void;
}

export default function OrderTracking({ orderId, onClose }: OrderTrackingProps) {
  const [trackingOrderId, setTrackingOrderId] = useState(orderId || '');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async () => {
    if (!trackingOrderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/orders/${trackingOrderId}`);
      setOrder(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Track Your Order</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order ID
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={trackingOrderId}
              onChange={(e) => setTrackingOrderId(e.target.value)}
              placeholder="Enter your order ID"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={trackOrder}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {order && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-sm text-gray-600">{getStatusDescription(order.status)}</p>
            </div>

            <div className="mb-4">
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

            {order.trackingNumber && (
              <div className="mb-2">
                <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
              </div>
            )}

            {order.estimatedDelivery && (
              <div className="mb-2">
                <span className="font-medium">Estimated Delivery:</span> {new Date(order.estimatedDelivery).toLocaleDateString()}
              </div>
            )}

            <div className="text-right">
              <span className="font-semibold">Total: ₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}