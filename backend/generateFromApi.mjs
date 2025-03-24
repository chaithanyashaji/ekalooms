import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendUrl = process.env.BACKEND_URL;
const API_URL = `${backendUrl}/api/product/list`;
const PUBLIC_DIR = path.join(__dirname, 'public');
const XML_PATH = path.join(PUBLIC_DIR, 'feed.xml');

// Google product category mappings
const categoryMap = {
  "Saree": "Apparel & Accessories > Clothing > Traditional & Cultural Clothing > Sarees",
  "Kurta Sets": "Apparel & Accessories > Clothing > Traditional & Cultural Clothing > Salwar Kameez",
  "Co-ords": "Apparel & Accessories > Clothing > Outfits & Sets",
  "Dresses": "Apparel & Accessories > Clothing > Dresses",
  "Dress materials": "Apparel & Accessories > Sewing & Needlecraft > Fabric",
  "Home Decor": "Home & Garden > Linens & Bedding"
};

async function generateFeed() {
  try {
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR);
    }

    const response = await axios.get(API_URL);
    const products = response.data.products;

    if (!products || products.length === 0) return;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Ekalooms Product Feed</title>
    <link>${backendUrl}</link>
    <description>Google Product Feed</description>`;

    products.forEach(product => {
      const productId = product._id;
      const title = product.name?.trim();
      const price = product.price;
      const imageLink = Array.isArray(product.image) && product.image.length > 0 ? product.image[0] : '';
      const productLink = `https://ekalooms.com/product/${productId}`;
      const description = product.description?.replace(/<[^>]*>/g, '').trim() || 'Handmade product from Ekalooms.';
      const availability = product.inStock ? 'in stock' : 'out of stock';
      const condition = 'new';
      const brand = 'Ekalooms';
      const category = categoryMap[product.category] || 'Apparel & Accessories';
      const productType = product.subCategory || 'N/A';

      if (!productId || !title || !price) return;

      xml += `
    <item>
      <g:id>${productId}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${productLink}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${price} INR</g:price>
      <g:condition>${condition}</g:condition>
      <g:brand>${brand}</g:brand>
      <g:google_product_category><![CDATA[${category}]]></g:google_product_category>
      <g:product_type><![CDATA[${productType}]]></g:product_type>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard</g:service>
        <g:price>150 INR</g:price>
      </g:shipping>
      <g:identifier_exists>false</g:identifier_exists>
    </item>`;
    });

    xml += `
  </channel>
</rss>`;

    fs.writeFileSync(XML_PATH, xml, 'utf8');
    console.log('✅ Product feed generated successfully at:', XML_PATH);
  } catch (err) {
    console.error('❌ Failed to generate product feed:', err.message);
  }
}

generateFeed();
export default generateFeed;
