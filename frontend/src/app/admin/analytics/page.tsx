'use client';

import { useEffect, useState } from 'react';
import api from '../../../utils/axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  monthOrders: number;
  monthRevenue: number;
  pendingOrders: number;
}

interface InventoryStats {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
  totalValue: number;
  stockUtilization: string;
}

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [salesByDay, setSalesByDay] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/summary'),
      api.get('/analytics/sales-by-day'),
      api.get('/analytics/top-products'),
      api.get('/analytics/category-stats'),
      api.get('/analytics/recent-orders'),
      api.get('/analytics/inventory-stats'),
    ]).then(([summaryRes, salesRes, productsRes, categoryRes, ordersRes, inventoryRes]) => {
      setSummary(summaryRes.data);
      setSalesByDay(salesRes.data);
      setTopProducts(productsRes.data);
      setCategoryStats(categoryRes.data);
      setRecentOrders(ordersRes.data);
      setInventoryStats(inventoryRes.data);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching analytics:', error);
      if (error.response?.status === 401) {
        // Handle unauthorized access
        console.log('Unauthorized access to analytics page');
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center">Loading...</div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics & Sales Reports</h1>
      
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
            <p className="text-3xl font-bold text-blue-600">{summary.totalOrders}</p>
            <p className="text-sm text-gray-500">Today: {summary.todayOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
            <p className="text-3xl font-bold text-green-600">
              ${summary.totalRevenue?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-500">Today: ${summary.todayRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">This Month</h2>
            <p className="text-3xl font-bold text-purple-600">{summary.monthOrders}</p>
            <p className="text-sm text-gray-500">Revenue: ${summary.monthRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Pending Orders</h2>
            <p className="text-3xl font-bold text-orange-600">{summary.pendingOrders}</p>
            <p className="text-sm text-gray-500">Awaiting payment</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sales (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts.map(p => ({
              name: p.Product?.title || 'Unknown',
              totalSold: Number(p.totalSold),
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Stats */}
      {inventoryStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Inventory Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{inventoryStats.totalProducts}</p>
                <p className="text-sm text-gray-600">Total Products</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
                <p className="text-sm text-gray-600">Out of Stock</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{inventoryStats.lowStock}</p>
                <p className="text-sm text-gray-600">Low Stock</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{inventoryStats.stockUtilization}%</p>
                <p className="text-sm text-gray-600">Stock Utilization</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                Total Inventory Value: <span className="font-semibold">${inventoryStats.totalValue?.toFixed(2) || '0.00'}</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Category Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryStats.map(c => ({
                name: c.Product?.Category?.name || 'Unknown',
                revenue: Number(c.totalRevenue),
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.User?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}