import { NextApiRequest, NextApiResponse } from 'next';
import { createSubscription, cancelSubscription, getSubscription } from '../../../backend/src/modules/subscriptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      await createSubscription(req, res);
      break;
    case 'DELETE':
      await cancelSubscription(req, res);
      break;
    case 'GET':
      await getSubscription(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST', 'DELETE', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
