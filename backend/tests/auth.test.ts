import request from 'supertest';
import app from '../app'; // Assuming you have an Express app instance in app.ts

describe('Auth Module', () => {
  let token: string;

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
        role: 'homeowner',
      });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });

  it('should login an existing user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });

  it('should not login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should access a protected route with valid token', async () => {
    const response = await request(app)
      .get('/api/protected-route')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should not access a protected route without token', async () => {
    const response = await request(app)
      .get('/api/protected-route');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token is missing or invalid');
  });

  it('should not access a protected route with invalid token', async () => {
    const response = await request(app)
      .get('/api/protected-route')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access token is missing or invalid');
  });
});
