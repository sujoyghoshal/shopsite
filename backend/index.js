const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const Routes = require("./routes/route.js");
   
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Stripe Secret Key from your .env file

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));

app.get('/', (req, res) => {
  res.json({ message: 'shopsite is running' });
});

// Stripe Payment Route
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Amount in paisa (100 paisa = 1 INR)

  try {
    // Create a PaymentIntent with the order amount and currency in INR
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount should be in paisa (1 INR = 100 paisa)
      currency: "inr", // Use INR as currency
      payment_method_types: ['card'], // Ensuring card payments
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Routes
app.use('/', Routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server started at port no. ${PORT}`);
});
