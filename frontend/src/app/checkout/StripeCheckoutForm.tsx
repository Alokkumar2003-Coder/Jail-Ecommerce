'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppSelector } from '../../redux/hooks';
import api from '../../utils/axios';

interface StripeCheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    shippingPhone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderNotes: string;
}

export default function StripeCheckoutForm({ 
  amount, 
  onSuccess, 
  customerDetails, 
  shippingAddress, 
  orderNotes 
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { items } = useAppSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Get client secret from backend
      const res = await api.post('/payment/create-payment-intent', { amount });
      const clientSecret = res.data.clientSecret;

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        // Create order after successful payment
        try {
          const orderData = {
            items: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress: shippingAddress,
            totalPrice: amount,
            paymentMethod: 'online',
            paymentStatus: 'paid',
            customerName: customerDetails.name,
            customerEmail: customerDetails.email,
            customerPhone: customerDetails.phone,
            shippingPhone: customerDetails.shippingPhone || customerDetails.phone,
            orderNotes: orderNotes || null,
          };

          await api.post('/orders', orderData);
          onSuccess();
        } catch (orderError) {
          console.error('Error creating order:', orderError);
          setError('Payment successful but order creation failed. Please contact support.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
      </button>
      
      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}
    </form>
  );
}