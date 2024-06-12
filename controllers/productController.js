const axios = require("axios");
const { shopify } = require("../config");

const getSessionHeaders = (accessToken) => ({
  "X-Shopify-Access-Token": accessToken,
  "Content-Type": "application/json",
});

const handleError = (error) => {
  if (error.response) {
    // The request was made, and the server responded with a status code that falls out of the range of 2xx
    return {
      status: error.response.status,
      message:
        error.response.data.errors ||
        error.response.data.error ||
        "An error occurred while processing the request.",
    };
  } else if (error.request) {
    // The request was made, but no response was received
    return {
      status: 500,
      message: "No response received from the server.",
    };
  } else {
    // Something happened in setting up the request that triggered an error
    return {
      status: 500,
      message:
        error.message || "An error occurred while setting up the request.",
    };
  }
};

const getProducts = async (req, res) => {
  try {
    const response = await axios.get(
      `https://${shopify.apiKey}:${shopify.shopToken}${shopify.shopName}/admin/api/2021-04/products.json`,
      {
        headers: getSessionHeaders(req.headers["x-shopify-access-token"]),
      }
    );
    res.status(200).json(response.data.products);
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ error: message });
  }
};



const createProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    const response = await axios.post(
      `https://${shopify.apiKey}:${shopify.shopToken}${shopify.shopName}/admin/api/2021-04/products.json`,
      { product: newProduct },
      {
        headers: getSessionHeaders(req.headers["x-shopify-access-token"]),
      }
    );
    res.status(201).json(response.data.product);
  } catch (error) {
    const { status, message } = handleError(error);
    res.status(status).json({ error: message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = req.body;
    const { id } = req.params;
    const response = await axios.put(
      `https://${shopify.apiKey}:${shopify.shopToken}${shopify.shopName}/admin/api/2021-04/products/${id}.json`,
      { product: updatedProduct },
      {
        headers: getSessionHeaders(req.headers["x-shopify-access-token"]),
      }
    );
    res.status(200).json(response.data.product);
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
    res.status(200).json({ success: true });
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
