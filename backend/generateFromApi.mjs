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
    <title>ekalooms Product Feed</title>
    <link>${backendUrl}</link>
    <description>Google Product Feed</description>`;

    products.forEach(product => {
      const imageLink = Array.isArray(product.image) && product.image.length > 0 ? product.image[0] : '';
      const productLink = `https://ekalooms.com/product/${product._id}`;
      const productId = product._id;

      if (!productId || !product.name || !product.price) return;

      xml += `
      <item>
        <g:id>${productId}</g:id>
        <g:title><![CDATA[${product.name}]]></g:title>
        <g:link>${productLink}</g:link>
        <g:image_link>${imageLink}</g:image_link>
        <g:price>${product.price} INR</g:price>
        <g:google_product_category><![CDATA[${product.category || 'N/A'}]]></g:google_product_category>
        <g:product_type><![CDATA[${product.subCategory || 'N/A'}]]></g:product_type>
      </item>`;
    });

    xml += `
  </channel>
</rss>`;

    fs.writeFileSync(XML_PATH, xml, 'utf8');
  } catch (err) {
    // Silent fail – useful for background jobs
  }
}

generateFeed();
export default generateFeed;
