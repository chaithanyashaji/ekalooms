import fs from "fs"
import axios from "axios"

const BASE_URL = 'https://ekalooms.com'; // Replace with your production domain

// Static Routes
const staticRoutes = [
  '/',
  '/collection',
  '/about',
  '/contact',
  '/cart',
  '/login',
  '/forgot-password',
  '/trackyourOrder',
  '/policy',
  '/collection/sarees',
  '/collection/home-decor',
  '/collection/stitched-suits',
  '/collection/unstitched-suits',
];

// Backend API URL for fetching products
const BACKEND_URL = 'https://ekalooms.onrender.com/api/product/list'; // Replace with your deployed backend URL in production

const fetchDynamicRoutes = async () => {
  try {
    // Fetch product data from the backend
    const response = await axios.get(BACKEND_URL);
    const products = response.data; // Assume the API returns an array of product objects with `id`

    // Generate product routes dynamically
    const productRoutes = products.map((product) => `/product/${product.id}`);

    // Combine static and dynamic routes
    const allRoutes = [...staticRoutes, ...productRoutes];

    // Build the sitemap
    const sitemapEntries = allRoutes.map((route) => {
      return `
        <url>
          <loc>${BASE_URL}${route}</loc>
          <changefreq>weekly</changefreq>
          <priority>${route === '/' ? 1.0 : 0.8}</priority>
        </url>
      `;
    });

    const sitemapContent = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapEntries.join('')}
      </urlset>
    `.trim();

    // Save the sitemap.xml to the public folder
    fs.writeFileSync('./public/sitemap.xml', sitemapContent, 'utf8');
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error fetching product data:', error);
  }
};

fetchDynamicRoutes();
