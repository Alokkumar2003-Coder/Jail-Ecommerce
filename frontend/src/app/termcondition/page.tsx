// app/terms-condition/page.tsx
export const runtime = "edge";
import React from "react";

const termsContent = [
  {
    title: "Introduction",
    paragraphs: [
      "Welcome to Jail.luxury. These Terms and Conditions (“Terms”) govern your use of our website and services provided by REXINE & LEATHER PRODUCT PRIVATE LIMITED. By accessing or using our website, you agree to comply with these Terms.",
    ],
  },
  {
    title: "Use of the Website",
    paragraphs: [
      "You must be at least 18 years old to use our website. You agree to use the website only for lawful purposes and in accordance with these Terms. We reserve the right to terminate or restrict your access to the website at any time without notice for any reason.",
    ],
  },
  {
    title: "Product Descriptions",
    paragraphs: [
      "We strive to provide accurate descriptions of our products. However, we do not warrant that the descriptions are complete or error-free. All prices are subject to change without notice.",
    ],
  },
  {
    title: "Orders and Payments",
    paragraphs: [
      "All orders placed through our website are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion. Payments must be made at the time of placing an order using the available payment methods.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      "All content on Jail.luxury, including text, graphics, logos, images, and software, is the property of REXINE & LEATHER PRODUCT PRIVATE LIMITED and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on our website without our prior written consent.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "To the fullest extent permitted by law, REXINE & LEATHER PRODUCT PRIVATE LIMITED shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products.",
    ],
  },
  {
    title: "Governing Law",
    paragraphs: [
      "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in India.",
    ],
  },
  {
    title: "Changes to Terms",
    paragraphs: [
      "We reserve the right to modify these Terms at any time. Any changes will be posted on this page, and your continued use of the website after such changes constitutes acceptance of the new Terms.",
    ],
  },
];

const TermsCondition: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Fixed Header */}
      <h1 className="bg-[#f2efe9] w-full h-[60px] flex items-center justify-center text-lg font-bold fixed  left-0 z-50 text-black shadow-md">
        Terms and Conditions
      </h1>

      {/* Main Content */}
      <main className="bg-[#f2efe9] text-[#2c2c2c] max-w-3xl mx-auto pt-[120px] pb-10 px-5 mb-1 ">
        {termsContent.map((section, index) => (
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

export default TermsCondition;
