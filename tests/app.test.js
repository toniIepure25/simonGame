const request = require('supertest');
const app = require('./app'); // Assuming your main app file is app.js
const db = require('./db'); // Assuming you have a db module for database interactions

beforeAll(async () => {
  await db.connect(); // Connect to the database before all tests
});

afterAll(async () => {
  await db.disconnect(); // Disconnect from the database after all tests
});

describe('Integration Tests for Main Functionality', () => {
  
  // Test for successful user registration
  test('POST /register - should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  // Test for user registration with existing username
  test('POST /register - should return error for existing username', async () => {
    await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password123' }); // Register first

    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'newpassword' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username already exists');
  });

  // Test for successful user login
  test('POST /login - should log in an existing user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  // Test for login with incorrect password
  test('POST /login - should return error for incorrect password', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  // Test for fetching user profile
  test('GET /profile - should return user profile for logged in user', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password123' });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  // Test for fetching profile without authentication
  test('GET /profile - should return error for unauthorized access', async () => {
    const response = await request(app)
      .get('/profile');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized');
  });

  // Test for edge case: empty username during registration
  test('POST /register - should return error for empty username', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: '', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username is required');
  });

  // Test for edge case: empty password during registration
  test('POST /register - should return error for empty password', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'newuser', password: '' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Password is required');
  });
});