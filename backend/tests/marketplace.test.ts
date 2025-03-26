import request from 'supertest';
import app from '../app'; // Assuming you have an Express app instance in app.ts

describe('Marketplace Module', () => {
  let token: string;
  let listingId: string;

  beforeAll(async () => {
    // Register and login a user to get a token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
        role: 'contractor',
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

  it('should create a new listing', async () => {
    const response = await request(app)
      .post('/api/marketplace')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Listing',
        description: 'This is a test listing',
        contractorId: 1,
        supplierId: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.listing).toBeDefined();
    listingId = response.body.listing.id;
  });

  it('should get an existing listing', async () => {
    const response = await request(app)
      .get(`/api/marketplace/${listingId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.listing).toBeDefined();
  });

  it('should update an existing listing', async () => {
    const response = await request(app)
      .put(`/api/marketplace/${listingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Listing',
        description: 'This is an updated test listing',
        contractorId: 2,
        supplierId: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body.listing).toBeDefined();
  });

  it('should delete an existing listing', async () => {
    const response = await request(app)
      .delete(`/api/marketplace/${listingId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Listing deleted successfully');
  });
});
