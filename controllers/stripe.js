import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import User from "../models/user.js";

const saveOrders = async (req, res, checkout, orders) => {
  if (orders.username !== "guest") {
    User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { orders: checkout }, $set: { cart: [], checkout: {} } },
      { new: true },
      (err, userInfo) => {}
    );
  }

  User.findOneAndUpdate(
    { role: "admin" },
    { $push: { orders: orders }, $set: { cart: [], checkout: {} } },
    { new: true },
    (err, userInfo) => {}
  );
};

const saveStripeId = async (req, res, customer) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { stripeId: { $ne: customer.id } } },
    { new: true },
    (err, userInfo) => {}
  );
};

export const singleCharge = async (req, res) => {
  console.log("log from singleCharge");

  const { token, checkoutTotal, description, checkout, orders } = req.body;
  const amount = Math.round(checkoutTotal * 100);
  try {
    const status = await stripe.charges.create({
      amount: amount,
      currency: "php",
      description: description,
      source: token.id,
    });
    saveOrders(req, res, checkout, orders);
    res.status(200).json({ status });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json(error.message);
  }
};

export const saveCardAndCharge = async (req, res) => {
  console.log("log from saveCardAndCharge");

  const { token, checkoutTotal, description, checkout, orders } = req.body;
  const amount = Math.round(checkoutTotal * 100);
  let { stripeId } = req.body;
  let customer;
  try {
    if (!stripeId) {
      customer = await stripe.customers.create();
      stripeId = customer.id;
    }

    const source = await stripe.customers.createSource(stripeId, {
      source: token.id,
    });

    const status = await stripe.charges.create({
      amount: amount,
      currency: "php",
      customer: stripeId,
      description: description,
      source: source.id,
    });

    saveOrders(req, res, checkout, orders);
    saveStripeId(req, res, customer);
    res.status(200).json({ status });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json(error.message);
  }
};
