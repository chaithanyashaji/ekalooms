import React from 'react';
import Title from '../components/Title';

const Policy = () => {
  return (
    <div>
      <div className="text-center text-4xl pt-10 border-t">
        <Title text1={'Our '} text2={'Policy'} />
      </div>
      <div className="my-10 px-6 md:px-20 text-gray-600 space-y-12">
        {/* Product Quality Information */}
        <section className="flex flex-col md:flex-row gap-10 items-center">
          <img
            className="w-full md:w-[40%] max-w-[350px] object-cover rounded-lg"
            src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222286/hero_img8_efebfh.jpg"
            alt="Product"
          />
          <div className="flex flex-col justify-start">
            <Title text1={'Product Quality '} text2={'Information'} />
            <p>
              All products are crafted with the finest handmade fabrics and materials. The raw finish of handmade items is the ultimate beauty of the craft and should not be compared to machine-finished products. Slight irregularities in color, print, weave, or thread pulls are inherent characteristics of handcrafted items, not defects.
            </p>
            <p className="mt-4">
              Products are photographed in natural sunlight to ensure accurate color representation. However, slight color variations may occur due to digital photography or differences in screen resolution/device settings. Returns or exchanges are not permitted for minor deviations in color between the displayed and received products.
            </p>
          </div>
        </section>

        {/* Placing Orders & Payments */}
        <section>
          <Title text1={'Placing Orders '} text2={'& Payments'} />
          <p>
            We accept only prepaid orders. Cash on Delivery (COD) is not available. Please ensure that all shipping information, including the correct pin code and active phone number, is provided for a smooth delivery experience.
          </p>
        </section>

        {/* Shipping Policy */}
        <section>
          <Title text1={'Shipping '} text2={'Policy'} />
          <p className="mb-4">
            <strong>Domestic Shipments:</strong> Dispatched within 2 working days. Delivery typically takes 5–7 working days.
          </p>
          <p className="mb-4">
            <strong>International Shipments:</strong> Dispatched within 7 working days. Tracking details will be shared.
          </p>
          <p className="mb-4">
            <strong>Delivery Charges:</strong>
          </p>
          <ul className="list-disc list-inside mb-6">
            <li>Normal Delivery: ₹60</li>
            <li>Fast Delivery: ₹95 (delivered within 2 days)</li>
            <li>Free Delivery: On orders above ₹1499</li>
          </ul>
        </section>

        {/* Refund & Cancellation Policy */}
        <section>
          <Title text1={'Refunds '} text2={'& Cancellations'} />
          <p>
            We do not offer refunds unless:
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>The product delivered is incorrect or damaged.</li>
            <li>There is an error in order placement.</li>
          </ul>
          <p className="mt-4">
            Customers must inform us within 24 hours of delivery and provide a parcel opening video as proof in case of product damage. Refunds, if approved, will be processed within 5–7 working days and credited to the customer's bank account.
          </p>
        </section>

        {/* Wash Instructions */}
        <section>
          <Title text1={'Wash '} text2={'Instructions'} />
          <p>To ensure the longevity of handcrafted fabrics:</p>
          <ul className="list-disc list-inside mt-4">
            <li>Hand wash gently in cold water.</li>
            <li>Use detergent formulated for delicate fabrics.</li>
            <li>Air dry naturally in a shaded area; avoid direct sunlight.</li>
          </ul>
          <p className="mt-4">
            <strong>Note:</strong> Minor irregularities, such as color smudges or border holes, are common and typically disappear after the first wash. For fabric-specific care instructions, please contact our team.
          </p>
        </section>

        {/* Pricing in INR */}
        <section>
          <Title text1={'Pricing '} text2={'Details'} />
          <p>
            All prices displayed on our website are in INR and inclusive of applicable taxes. Please refer to our <strong>Billing Label</strong> section for further information.
          </p>
        </section>

        {/* Terms & Conditions */}
        <section>
          <Title text1={'Terms '} text2={'& Conditions'} />
          <p>
            By using this website, you agree to comply with and be bound by the stated terms and conditions. We reserve the right to update or modify these terms at any time without prior notice.
          </p>
        </section>

        {/* Contact Us */}
        <section>
          <Title text1={'Contact '} text2={'Us'} />
          <p>
            For any queries, please contact us at:
            <br />
            <strong>Phone:</strong> +91-9113054569
            <br />
            <strong>Email:</strong> ekalooms@gmail.com
            <br />
            
          </p>
        </section>
      </div>
    </div>
  );
};

export default Policy;
