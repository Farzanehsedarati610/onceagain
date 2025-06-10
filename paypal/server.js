const express = require('express');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/payment');

const app = express();
app.use(bodyParser.json());
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));

