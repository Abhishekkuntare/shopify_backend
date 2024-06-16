const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/ordersRoutes");

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", productRoutes);
app.use("/api", orderRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
