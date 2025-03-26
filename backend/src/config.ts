import dotenv from 'dotenv';
import { Pool } from 'pg';
import { QdrantClient } from '@qdrant/js-client-rest';

dotenv.config();

const {
  DATABASE_URL,
  QDRANT_URL,
  JWT_SECRET,
  STRIPE_API_KEY,
} = process.env;

if (!DATABASE_URL || !QDRANT_URL || !JWT_SECRET || !STRIPE_API_KEY) {
  throw new Error('Missing required environment variables');
}

export const db = new Pool({
  connectionString: DATABASE_URL,
});

export const qdrantClient = new QdrantClient(QDRANT_URL);

export const config = {
  jwtSecret: JWT_SECRET,
  stripeApiKey: STRIPE_API_KEY,
};
