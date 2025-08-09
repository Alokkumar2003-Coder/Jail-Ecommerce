// app/return-refund/page.tsx
export const runtime = "edge";
import React from "react";

const returnRefundContent = [
  {
    title: "Return Policy",
    paragraphs: [
      "If you are not satisfied with your purchase, you may return the product within 5 days of delivery. To be eligible for a return, the item must be unused, in its original packaging, and in the same condition that you received it.",
    ],
  },
  {
    title: "Refund Policy",
    paragraphs: [
      "Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will be applied to your original method of payment within 10 days.",
    ],
  },
  {
    title: "Non-Returnable Items",
    paragraphs: [
      "Certain items, such as personalized or custom-made products, are not eligible for returns.",
    ],
  },
  {
    title: "How to Initiate a Return",
    paragraphs: [
      "To initiate a return, please contact our customer service at aadityaa.kumar3@gmail.com with your order details.",
    ],
  },
  {
    title: "Changes to this Policy",
    paragraphs: [
      "We reserve the right to update this policy at any time. Any changes will be posted on this page, and your continued use of the website constitutes acceptance of the updated policy.",
    ],
  },
];

const ReturnRefund = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Fixed Header */}
      <h1 className="bg-[#f2efe9] w-full h-[60px] flex items-center justify-center text-lg font-bold fixed  left-0 z-50 text-black shadow-md">
        Returns and Refunds Policy
      </h1>

      {/* Main Content */}
      <main className="bg-[#f2efe9] text-[#2c2c2c] max-w-3xl mx-auto pt-[120px] pb-10 px-5 mb-2 ">
        {returnRefundContent.map((section, index) => (
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

export default ReturnRefund;
