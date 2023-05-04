require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = 3000;

app.use("/stripe", express.raw({ type: "/" }));
app.use(express.json());
app.use(cors());

app.post("/pay", async (req, res) => {
  try {
    const { newPrice } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: newPrice,
      currency: "ron",
      payment_method_types: ["card"],
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ message: "Payment initiated", clientSecret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = await stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
  if (event.type === "payment_intent.created") {
    console.log(`${event.data.object.metadata.name} initiated payment!`);
  }
  if (event.type === "payment_intent.succeeded") {
    console.log(`${event.data.object.metadata.name} succeeded payment!`);
  }
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
