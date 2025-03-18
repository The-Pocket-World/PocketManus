import request from 'supertest';
import app from '../app'; // Assuming you have an Express app instance in app.ts

describe('Subscriptions Module', () => {
  let token: string;
  let subscriptionId: string;

  beforeAll(async () => {
    // Register and login a user to get a token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
        role: 'homeowner',
      });

    token = registerResponse.body.token;

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    token = loginResponse.body.token;
  });

  it('should create a new subscription', async () => {
    const response = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerId: 'cus_test',
        priceId: 'price_test',
      });

    expect(response.status).toBe(201);
    expect(response.body.subscription).toBeDefined();
    subscriptionId = response.body.subscription.id;
  });

  it('should get an existing subscription', async () => {
    const response = await request(app)
      .get(`/api/subscriptions/${subscriptionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.subscription).toBeDefined();
  });

  it('should cancel an existing subscription', async () => {
    const response = await request(app)
      .delete('/api/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        subscriptionId,
      });

    expect(response.status).toBe(200);
    expect(response.body.deletedSubscription).toBeDefined();
  });
});
