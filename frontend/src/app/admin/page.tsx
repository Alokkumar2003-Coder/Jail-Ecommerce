import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-blue-500 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">Manage Products</h2>
          <p className="text-gray-600">Add, edit, and delete products</p>
        </Link>
        
        <Link
          href="/admin/categories"
          className=" p-6 bg-green-500 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">Manage Categories</h2>
          <p className="text-gray-600">Organize products by categories</p>
        </Link>
        
        <Link
          href="/admin/orders"
          className="bg-red-500 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">Manage Orders</h2>
          <p className="text-gray-600">View and update order status</p>
        </Link>
        
        <Link
          href="/admin/users"
          className="bg-yellow-500 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">Manage Users</h2>
          <p className="text-gray-600">View user accounts and roles</p>
        </Link>
        
        <Link
          href="/admin/analytics"
          className="bg-purple-500 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">Analytics</h2>
          <p className="text-gray-600">View sales reports and insights</p>
        </Link>
         <Link
          href="/admin/blogs"
          className="bg-gray-500 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">Blogs</h2>
          <p className="text-gray-600">Add, Edit and Delete Blogs</p>
        </Link>
        <Link
          href="/admin/carousel"
          className="bg-emerald-500 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">Carousel</h2>
          <p className="text-gray-600">Add, Edit and Delete Carousel Items</p>
        </Link>
        <Link
          href="/admin/carousel"
          className="bg-orange-500 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">News</h2>
          <p className="text-gray-600">Add, Edit and Delete Carousel Items</p>
        </Link>
      </div>
    </div>
  );
}