import Stripe from 'stripe';
import { Request, Response } from 'express';
import { Subscription } from './models/subscription';

const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {
  apiVersion: '2020-08-27',
});

export const createSubscription = async (req: Request, res: Response) => {
  const { customerId, priceId } = req.body;

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    const newSubscription = new Subscription({
      customerId,
      subscriptionId: subscription.id,
      status: subscription.status,
      priceId,
    });

    await newSubscription.save();

    res.status(201).json({ subscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  const { subscriptionId } = req.body;

  try {
    const deletedSubscription = await stripe.subscriptions.del(subscriptionId);

    await Subscription.findOneAndUpdate(
      { subscriptionId },
      { status: 'canceled' }
    );

    res.status(200).json({ deletedSubscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSubscription = async (req: Request, res: Response) => {
  const { subscriptionId } = req.params;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    res.status(200).json({ subscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
