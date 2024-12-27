import React from 'react';
import Title from '../components/Title';

const Policy = () => {
  return (
    <div>
      <div className="text-center text-4xl pt-10 border-t">
        <Title text1={'Our '} text2={'Policy'} />
      </div>
      <div className="my-10 px-6 md:px-20 text-gray-600">
        {/* Product Quality Information */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <img
            className="w-full md:w-[40%] max-w-[350px] object-cover rounded-lg"
            src="https://res.cloudinary.com/dzzhbgbnp/image/upload/v1735222286/hero_img8_efebfh.jpg"
            alt="Product"
          />
          <div className="flex flex-col Outfit justify-start">
            <Title text1={'Product Quality '} text2={'Information'} />
            <p className="mb-6">
              All products have been made with the finest handmade fabrics and materials. Please keep in mind that the
              excellent raw finish of handmade items should never be compared to machine finish products as its raw finish
              is the ultimate beauty of the craft. Irregularities which may occur are characteristics of the handcrafted
              process. Slight irregularities in colour or print or weave or any thread pull are due to the fact that the
              fabric is hand painted/hand woven/hand printed. These are not defects but the very nature of handcrafted
              products.
            </p>
            <p className="mb-6">
              Products have been photographed in natural sunlight to capture the right colour. However, there may be slight
              differences due to digital photography and your screen resolutions/device settings. Returns/exchange is
              denied for deviations in colour from the product displayed to the product received by you.
            </p>
          </div>
        </div>

        {/* Placing Orders & Payments */}
        <div className="mt-8">
          <Title text1={'Placing Orders '} text2={'& Payments'} />
          <p className="mb-6">
            Kindly note we only accept prepaid orders. We do not provide Cash on Delivery options. Kindly fill your
            shipping information in detail with the correct pincode & phone number that is in use for a smooth delivery
            process.
          </p>
        </div>

        {/* Shipping Policy */}
        <div className="mt-8">
          <Title text1={'Shipping '} text2={'Policy'} />
          <p className="mb-8">
            All domestic shipments are dispatched within 2 working days, and all international shipments will be
            dispatched within 7 working days & shared along with the tracking details. Normal delivery takes 5-7 days, and
            fast delivery is available within 2 days for an additional charge of INR 95. Shop above INR 1499 to avail free
            delivery. Delivery charges: Normal Delivery INR 60, Fast Delivery INR 95.
          </p>
        </div>

        {/* Refund & Cancellation Policy */}
        <div className="mt-8">
          <Title text1={'Refunds '} text2={'& Cancellations'} />
          <p className="mb-8">
          Kindly note that we do not follow a refund policy and do not offer a refund on any orders unless the product
            delivered is incorrect/damaged or if there is an error in order placement. The customer is required to inform us within 24 hours of delivery with the
            parcel opening video as proof (incase of product damage). Refunds, if approved, will be processed within 5-7 working days, and the amount
            will be credited to the customer's bank account.
          </p>
        </div>

        <div className="mt-8">
          <Title text1={'Wash '} text2={'Instructions'} />
          <p className="mb-8">
            For long-lasting care of handcrafted fabrics, please ensure:
          </p>
          <ul className="list-disc list-inside mb-6">
            <li>Gentle hand wash in cold water</li>
            <li>Use detergent specifically formulated for delicate fabrics</li>
            <li>Air dry naturally in a shaded area. Avoid direct sunlight</li>
          </ul>
          <p className="mb-8">
            <strong>Note:</strong> Handcrafted fabrics may have minor differences, color smudges, or border holes which are
            common and usually go away in one wash. For fabric-specific wash instructions, please reach out to our team.
          </p>
        </div>

        {/* Pricing in INR */}
        <div className="mt-8">
          <Title text1={'Pricing '} text2={'Details'} />
          <p className="mb-8">All prices listed on our website are in INR and inclusive of applicable taxes.</p>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-8">
          <Title text1={'Terms '} text2={'& Conditions'} />
          <p className="mb-8">
            By using this website, you agree to comply with and be bound by the terms and conditions of use. We reserve the
            right to update or modify these terms at any time without prior notice.
          </p>
        </div>

        {/* Contact Us */}
        <div className="mt-8">
          <Title text1={'Contact '} text2={'Us'} />
          <p className="mb-8">
            For any queries, reach out to us at:
            <br />
            Phone: +91-9113054569
            <br />
            Contact us :  ekalooms@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
