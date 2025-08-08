'use client';

interface PaymentMethodSelectorProps {
  selectedMethod: 'online' | 'cod';
  onMethodChange: (method: 'online' | 'cod') => void;
}

export default function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      {/* Online Payment Option */}
      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <input
          type="radio"
          name="paymentMethod"
          value="online"
          checked={selectedMethod === 'online'}
          onChange={(e) => onMethodChange(e.target.value as 'online' | 'cod')}
          className="mr-3"
        />
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold">Online Payment</div>
            <div className="text-sm text-gray-600">Pay securely with your card</div>
          </div>
        </div>
      </label>

      {/* Cash on Delivery Option */}
      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <input
          type="radio"
          name="paymentMethod"
          value="cod"
          checked={selectedMethod === 'cod'}
          onChange={(e) => onMethodChange(e.target.value as 'online' | 'cod')}
          className="mr-3"
        />
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold">Cash on Delivery</div>
            <div className="text-sm text-gray-600">Pay with cash when delivered</div>
          </div>
        </div>
      </label>
    </div>
  );
}