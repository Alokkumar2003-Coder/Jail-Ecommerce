// app/cancellationpolicy/page.tsx
export const runtime = "edge";
import React from "react";

const cancellationContent = [
  {
    title: "Cancellation Policy",
    paragraphs: [
      "At Jail.Luxury, we strive to ensure that our customers are completely satisfied with their purchases. To make the process as smooth as possible, we offer an open box delivery service. This means that you have the opportunity to inspect the product at the time of delivery. If you find that the product does not meet your expectations during this open box delivery, you may cancel the order free of charge. Please note, however, that if the product is delivered and a few hours or more have passed before you decide that it is not to your liking, our cancellation and refund policies will no longer be applicable.",
    ],
  },
];

const CancellationPolicy = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Fixed Header */}
      <h1 className="bg-[#f2efe9] w-full h-[60px] flex items-center justify-center text-lg font-bold fixed  left-0 z-50 text-black shadow-md">
        Cancellation Policy
      </h1>

      {/* Main Content */}
      <main className="bg-[#f2efe9] text-[#2c2c2c] max-w-3xl mx-auto pt-[120px] pb-10 px-5 ">
        {cancellationContent.map((section, index) => (
          <div key={index}>
            <h2 className="text-lg font-bold mt-8 text-gray-900">
              {section.title}
            </h2>
            {section.paragraphs.map((text, idx) => (
              <p
                key={idx}
                className="text-base leading-8 mb-4 text-gray-700"
              >
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

export default CancellationPolicy;
