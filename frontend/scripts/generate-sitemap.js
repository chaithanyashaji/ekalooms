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
    let page = 1;
    const limit = 20; // Adjust the limit based on your API capabilities
    let hasMore = true;
    const productRoutes = [];

    while (hasMore) {
      // Fetch paginated products
      const response = await axios.get(BACKEND_URL, {
        params: { page, limit },
      });

      // Check if API response indicates success
      if (response.data.success) {
        const products = response.data.products; // Extract products array

        // Add product routes
        products.forEach((product) => {
          productRoutes.push(`/product/${product._id}`);
        });

        // Check pagination
        const { currentPage, totalPages } = response.data.pagination;
        hasMore = currentPage < totalPages; // Continue fetching if more pages exist
        page++;
      } else {
        console.error('API error:', response.data.message);
        break;
      }
    }

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

    // Write the sitemap to the public folder
    fs.writeFileSync('./public/sitemap.xml', sitemapContent, 'utf8');
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error fetching product data:', error.message);
  }
};

fetchDynamicRoutes();
