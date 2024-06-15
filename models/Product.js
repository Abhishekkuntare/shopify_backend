const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  inventoryQuantity: {
    type: Number,
    required: true,
  },
  shopifyId: String,
  imageAlt: String,
  imageSrc: String,
});

module.exports = mongoose.model("Product", productSchema);
