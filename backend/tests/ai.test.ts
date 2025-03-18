import request from 'supertest';
import app from '../app'; // Assuming you have an Express app instance in app.ts

describe('AI Module', () => {
  let token: string;

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

  it('should access the roof damage assessment endpoint', async () => {
    const response = await request(app)
      .post('/api/ai/damage-assessment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        imageUrl: 'http://example.com/roof.jpg',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Roof damage assessment endpoint');
  });

  it('should access the scheduling optimization endpoint', async () => {
    const response = await request(app)
      .post('/api/ai/scheduling-optimization')
      .set('Authorization', `Bearer ${token}`)
      .send({
        scheduleData: {
          tasks: [
            { id: 1, duration: 2 },
            { id: 2, duration: 3 },
          ],
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Scheduling optimization endpoint');
  });
});
