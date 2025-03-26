import request from 'supertest';
import app from '../app'; // Assuming you have an Express app instance in app.ts

describe('Projects Module', () => {
  let token: string;
  let projectId: string;

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

  it('should create a new project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'This is a test project',
        propertyId: 1,
        inspectionId: 1,
        estimateId: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.project).toBeDefined();
    projectId = response.body.project.id;
  });

  it('should get an existing project', async () => {
    const response = await request(app)
      .get(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.project).toBeDefined();
  });

  it('should update an existing project', async () => {
    const response = await request(app)
      .put(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Test Project',
        description: 'This is an updated test project',
        propertyId: 2,
        inspectionId: 2,
        estimateId: 2,
      });

    expect(response.status).toBe(200);
    expect(response.body.project).toBeDefined();
  });

  it('should delete an existing project', async () => {
    const response = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Project deleted successfully');
  });
});
