// app/shipping-policy/page.tsx
export const runtime = "edge";
import React from "react";

const shippingContent = [
  {
    title: "Order Processing",
    paragraphs: [
      "All orders are processed within 2 days of receipt. You will receive a confirmation email once your order has been shipped.",
    ],
  },
  {
    title: "Shipping Time",
    paragraphs: [
      "Orders are typically delivered within 5 days after shipment.",
    ],
  },
  {
    title: "Shipping Charges",
    paragraphs: [
      "Shipping charges will be calculated at checkout and are based on your location and the weight of your order.",
    ],
  },
  {
    title: "Tracking Your Order",
    paragraphs: [
      "Once your order has been shipped, you will receive a tracking number to monitor the delivery status.",
    ],
  },
  {
    title: "International Shipping",
    paragraphs: [
      "Currently, we only ship within India. We do not offer international shipping at this time.",
    ],
  },
  {
    title: "Delays",
    paragraphs: [
      "Please note that delivery times may be extended due to unforeseen circumstances such as weather conditions or carrier delays.",
    ],
  },
  {
    title: "Changes to this Policy",
    paragraphs: [
      "We reserve the right to update this policy at any time. Any changes will be posted on this page, and your continued use of the website constitutes acceptance of the updated policy.",
    ],
  },
];

const ShippingPolicy = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Fixed Header */}
      <h1 className="bg-[#f2efe9] w-full h-[60px] flex items-center justify-center text-lg font-bold fixed  left-0 z-50 text-black shadow-md">
        Shipping Policy for Jail.luxury powered by REXINE & LEATHER PRODUCT PRIVATE LIMITED
      </h1>

      {/* Main Content */}
      <main className="bg-[#f2efe9] text-[#2c2c2c] max-w-3xl mx-auto pt-[120px] pb-10 px-5 ">
        {shippingContent.map((section, index) => (
          <div key={index}>
            <h2 className="text-lg font-bold mt-8 text-gray-900">
              {section.title}
            </h2>
            {section.paragraphs.map((text, idx) => (
              <p key={idx} className="text-base leading-8 mb-4 text-gray-700">
                {text}
              </p>
            ))}
          </div>
        ))}

        {/* Contact Information */}
        <h2 className="text-lg font-bold mt-8 text-gray-900">
          Contact Information
        </h2>
        <p className="text-base font-semibold mt-4 text-gray-800">
          Mail Id: support@jail.luxury
        </p>
        <p className="text-base font-semibold mt-2 text-gray-800">
          Call Us: 88 77 77 22 77
        </p>
      </main>
    </div>
  );
};

export default ShippingPolicy;
