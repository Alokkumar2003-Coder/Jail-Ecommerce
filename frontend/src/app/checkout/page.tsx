'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { clearCart } from '../../redux/cartSlice';
import { useRouter } from 'next/navigation';
import api from '../../utils/axios';
import StripeCheckoutForm from './StripeCheckoutForm';

export default function CheckoutPage() {
  const { items } = useAppSelector((state) => state.cart);
  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = () => {
    if (!shipping.address || !shipping.city || !shipping.postalCode || !shipping.country) {
      setError('Please fill in all shipping details');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      await api.post('/orders', {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: shipping,
        totalPrice: total,
        paymentStatus: 'paid',
      });
      dispatch(clearCart());
      router.push('/order-confirmation');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <input
              name="address"
              placeholder="Address"
              value={shipping.address}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <input
              name="city"
              placeholder="City"
              value={shipping.city}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <input
              name="postalCode"
              placeholder="Postal Code"
              value={shipping.postalCode}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
            <input
              name="country"
              placeholder="Country"
              value={shipping.country}
              onChange={handleChange}
              className="w-full border p-3 rounded"
              required
            />
          </div>
          
          {!showPayment && (
            <button
              onClick={handleProceedToPayment}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mt-6"
            >
              Proceed to Payment
            </button>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="border rounded-lg p-6">
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>{item.title} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {showPayment && (
            <div className="mt-6">
              <StripeCheckoutForm amount={total} onSuccess={handlePaymentSuccess} />
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 mt-4 text-center">{error}</div>
      )}
    </div>
  );
}