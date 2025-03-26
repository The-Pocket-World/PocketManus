import request from 'supertest';
import app from '../app'; // Assuming you have an Express app instance in app.ts

describe('Insurance Module', () => {
  let token: string;
  let claimId: string;

  beforeAll(async () => {
    // Register and login a user to get a token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
        role: 'insurance',
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

  it('should create a new claim', async () => {
    const response = await request(app)
      .post('/api/insurance')
      .set('Authorization', `Bearer ${token}`)
      .send({
        policyNumber: '123456',
        description: 'Test claim',
        amount: 1000,
        status: 'pending',
      });

    expect(response.status).toBe(201);
    expect(response.body.claim).toBeDefined();
    claimId = response.body.claim.id;
  });

  it('should get an existing claim', async () => {
    const response = await request(app)
      .get(`/api/insurance/${claimId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.claim).toBeDefined();
  });

  it('should update an existing claim', async () => {
    const response = await request(app)
      .put(`/api/insurance/${claimId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        policyNumber: '123456',
        description: 'Updated test claim',
        amount: 1500,
        status: 'approved',
      });

    expect(response.status).toBe(200);
    expect(response.body.claim).toBeDefined();
  });

  it('should delete an existing claim', async () => {
    const response = await request(app)
      .delete(`/api/insurance/${claimId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Claim deleted successfully');
  });
});
