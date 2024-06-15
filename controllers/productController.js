const axios = require("axios");
const { shopify } = require("../config");
const Product = require("../models/Product");

const getSessionHeaders = (accessToken) => ({
  "X-Shopify-Access-Token": accessToken,
  "Content-Type": "application/json",
});

const handleError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message:
        error.response.data.errors ||
        error.response.data.error ||
        "An error occurred while processing the request.",
    };
  } else if (error.request) {
    return {
      status: 500,
      message: "No response received from the server.",
    };
  } else {
    return {
      status: 500,
      message:
        error.message || "An error occurred while setting up the request.",
    };
  }
};

const getProducts = async (req, res) => {
  try {
    const shopifyResponse = await axios.get(
      `https://${shopify.apiKey}:${shopify.shopToken}${shopify.shopName}/admin/api/2021-04/products.json`,
      {
        headers: getSessionHeaders(req.headers["x-shopify-access-token"]),
      }
    );

    const mongoDBProducts = await Product.find();

    const shopifyProducts = Array.isArray(shopifyResponse.data.products)
      ? shopifyResponse.data.products
      : [];
    const mongoDBProductsArray = Array.isArray(mongoDBProducts)
      ? mongoDBProducts
      : [];

    res.status(200).json(shopifyResponse.data.products);
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ error: message });
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = req.body;

    const shopifyResponse = await axios.post(
      `https://${shopify.apiKey}:${shopify.shopToken}${shopify.shopName}/admin/api/2021-04/products.json`,
      { product: newProduct },
      {
        headers: getSessionHeaders(req.headers["x-shopify-access-token"]),
      }
    );

    const createdShopifyProduct = shopifyResponse.data.product;
    const shopifyId = createdShopifyProduct.id;

    const mongoDBProduct = new Product({
      title: createdShopifyProduct.title,
      vendor: createdShopifyProduct.vendor,
      productType: createdShopifyProduct.product_type,
      price: createdShopifyProduct.variants[0].price,
      sku: createdShopifyProduct.variants[0].sku,
      inventoryQuantity: createdShopifyProduct.variants[0].inventory_quantity,
      imageAlt: createdShopifyProduct.images[0]?.alt,
      imageSrc: createdShopifyProduct.images[0]?.src,
      shopifyId: shopifyId,
    });

    const savedProduct = await mongoDBProduct.save();

    res.status(201).json({
      shopifyId,
      shopifyProduct: createdShopifyProduct,
    });
    // res.status(201).json({
    //   // shopifyId,
    //   // mongoDBId: savedProduct._id,
    //   shopifyProduct: createdShopifyProduct,
    //   // mongoDBProduct: savedProduct,
    // });
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ error: message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = req.body;
    const { id } = req.params;

    // Update product in Shopify
    const shopifyResponse = await axios.put(
      `https://${shopify.apiKey}:${shopify.shopToken}${shopify.shopName}/admin/api/2021-04/products/${id}.json`,
      { product: updatedProduct },
      {
        headers: getSessionHeaders(req.headers["x-shopify-access-token"]),
      }
    );

    // Extract updated product details from Shopify response
    const updatedShopifyProduct = shopifyResponse.data.product;

    // Update product in MongoDB
    const mongoDBProduct = await Product.findOneAndUpdate(
      { shopifyId: id }, // Find by Shopify ID
      {
        title: updatedShopifyProduct.title,
        vendor: updatedShopifyProduct.vendor,
        productType: updatedShopifyProduct.product_type,
        price: updatedShopifyProduct.variants[0].price,
        sku: updatedShopifyProduct.variants[0].sku,
        inventoryQuantity: updatedShopifyProduct.variants[0].inventory_quantity,
        imageAlt: updatedShopifyProduct.images[0]?.alt,
        imageSrc: updatedShopifyProduct.images[0]?.src,
      },
      { new: true } // Return the updated document
    );

    if (!mongoDBProduct) {
      return res.status(404).json({ error: "Product not found in MongoDB." });
    }

    res.status(200).json({
      shopifyProduct: updatedShopifyProduct,
      // mongoDBProduct,
    });
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ error: message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await axios.delete(
      `https://${shopify.apiKey}:${shopify.shopToken}${shopify.shopName}/admin/api/2021-04/products/${id}.json`,
      {
        headers: getSessionHeaders(req.headers["x-shopify-access-token"]),
      }
    );

    const deletedMongoDBProduct = await Product.findOneAndDelete({
      shopifyId: id,
    });

    if (!deletedMongoDBProduct) {
      return res.status(404).json({ error: "Product not found in MongoDB." });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully from both Shopify and MongoDB.",
    });
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ error: message });
  }
};
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
