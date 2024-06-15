const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  shopify: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecret: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SHOPIFY_SCOPES.split(","),
    shopName: process.env.SHOPIFY_SHOP,
    shopToken: process.env.SHOPIFY_TOKEN,
  },
};
