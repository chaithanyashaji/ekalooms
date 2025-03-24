import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config(); // Load env variables

// Helpers to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG
const backendUrl = process.env.BACKEND_URL; // Load from .env
const API_URL = `${backendUrl}/api/product/list`;
const XML_PATH = path.join(__dirname, 'public', 'feed.xml');

async function generateFeed() {
  try {
    const response = await axios.get(API_URL);
    const products = response.data.products;
    


    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ekalooms Product Feed</title>
    <link>${backendUrl}</link>
    <description>Google Product Feed</description>`;

    products.forEach(product => {
        const imageLink = Array.isArray(product.image) && product.image.length > 0
          ? product.image[0]
          : '';
      
        const productLink = `https://ekalooms.com/product/${product._id}`;
      
        xml += `
        <item>
          <g:title><![CDATA[${product.name}]]></g:title>
          <g:link>${productLink}</g:link>
          <g:image_link>${imageLink}</g:image_link>
          <g:price>${product.price} INR</g:price>
          <g:google_product_category><![CDATA[${product.category}]]></g:google_product_category>
          <g:product_type><![CDATA[${product.subCategory}]]></g:product_type>
        </item>`;
      });
      

    xml += `
  </channel>
</rss>`;

    fs.writeFileSync(XML_PATH, xml, 'utf8');
    console.log('✅ feed.xml generated successfully at', XML_PATH);
  } catch (err) {
    console.error('❌ Failed to generate feed:', err.message);
  }
}

generateFeed();
