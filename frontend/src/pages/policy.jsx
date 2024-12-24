import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const Policy = () => {
  return (
    <div>
      <div className="text-center text-4xl pt-10 border-t">
        <Title text1={'Our '} text2={'Policy'} />
      </div>
      <div className="my-10 px-6 md:px-20 text-gray-600">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <img
            className="w-full md:w-[40%] max-w-[350px] object-cover rounded-lg"
            src={assets.hero_img8}
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
            <div>
              <Title text1={'Placing Orders '} text2={'& Payments'} />
              <p className="mb-6">
                Kindly note we only accept prepaid orders. We do not provide Cash on Delivery options. Kindly fill your shipping information
                in detail with the correct pincode & phone number that is in use for a smooth delivery process.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Title text1={'Shipping '} text2={'Policy'} />
          <p className="mb-8">
            All domestic shipments are dispatched within 2 working days, and all international shipments will be
            dispatched within 7 working days & shared along with the tracking details. While shipments usually get
            delivered earlier than or within the 7 days of standard delivery time, there can be rare exceptions where the
            delivery gets delayed from the courier agency's side or due to any natural calamities like rains, floods, etc.,
            which is beyond our control. We shall not be liable for any delays in delivery by the post office/courier
            agencies.
          </p>
        </div>

        <Title text1={'Exchange '} text2={'Policy'} />
        <p className="mb-8">
          Kindly note that we do not follow a refund policy and do not offer a refund on any orders. All products are
          pre-checked for quality & defects before they are shipped. Despite our best efforts, if the product delivered
          is incorrect/damaged, the customer is required to inform us within 24 hours of delivery with the parcel
          opening video as proof of the same. The cost of return/exchange in such cases has to be borne by the customer.
          We hold all the rights to not accept the products in case they are used or damaged by the customer.
        </p>
      </div>
    </div>
  );
};

export default Policy;
