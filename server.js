const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/ordersRoutes');

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
