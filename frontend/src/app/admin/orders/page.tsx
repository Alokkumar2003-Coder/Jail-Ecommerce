'use client';

import { useEffect, useState } from 'react';
import api from '../../../utils/axios';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: { id: number; title: string };
}

interface Order {
  id: number;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  createdAt: string;
  OrderItems: OrderItem[];
  User: { name: string; email: string };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (orderId: number, status: string) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="text-center">Loading...</div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">{order.User.name} ({order.User.email})</p>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {order.OrderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product.title}</span>
                  <span>x {item.quantity} (${item.price.toFixed(2)} each)</span>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}