'use client';

interface PaymentMethodSelectorProps {
  selectedMethod: 'online' | 'cod';
  onMethodChange: (method: 'online' | 'cod') => void;
}

export default function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
      
      <div className="space-y-3">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="online"
            checked={selectedMethod === 'online'}
            onChange={(e) => onMethodChange(e.target.value as 'online' | 'cod')}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <div className="ml-3">
            <div className="flex items-center">
              <span className="font-medium">Online Payment</span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Secure</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Pay securely with your credit/debit card or digital wallet
            </p>
          </div>
        </label>

        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={selectedMethod === 'cod'}
            onChange={(e) => onMethodChange(e.target.value as 'online' | 'cod')}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <div className="ml-3">
            <div className="flex items-center">
              <span className="font-medium">Cash on Delivery (COD)</span>
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Pay Later</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Pay with cash when your order is delivered
            </p>
          </div>
        </label>
      </div>

      {selectedMethod === 'cod' && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Additional charges may apply for COD orders
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                A small convenience fee of ₹50 will be added to your order total
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
