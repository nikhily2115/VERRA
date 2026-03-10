const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');

describe('Authentication Flow Integration Tests', () => {
  describe('Complete User Registration and Login Flow', () => {
    it('should register a new user, login, access protected route, and logout', async () => {
      // Step 1: Register a new user
      const registerData = {
        name: 'Integration Test User',
        email: 'integration@test.com',
        password: 'Password123!',
        role: 'user',
      };

      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(registerData)
        .expect(201);

      expect(registerRes.body.success).toBe(true);
      expect(registerRes.body.message).toContain('registered successfully');

      // Verify user was created in database
      const user = await User.findOne({ email: registerData.email });
      expect(user).toBeDefined();
      expect(user.name).toBe(registerData.name);
      expect(user.role).toBe(registerData.role);

      // Step 2: Login with the registered user
      const loginData = {
        email: registerData.email,
        password: registerData.password,
      };

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(loginRes.body.success).toBe(true);
      expect(loginRes.body.user).toBeDefined();
      expect(loginRes.body.user.email).toBe(registerData.email);

      // Extract cookie from login response
      const cookies = loginRes.headers['set-cookie'];
      expect(cookies).toBeDefined();

      // Step 3: Access protected route with cookie
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies)
        .expect(200);

      expect(meRes.body.success).toBe(true);
      expect(meRes.body.user.email).toBe(registerData.email);

      // Step 4: Logout
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies)
        .expect(200);

      expect(logoutRes.body.success).toBe(true);

      // Step 5: Verify cannot access protected route after logout
      const logoutCookies = logoutRes.headers['set-cookie'];
      
      await request(app)
        .get('/api/auth/me')
        .set('Cookie', logoutCookies)
        .expect(401);
    });

    it('should prevent duplicate email registration', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@test.com',
        password: 'Password123!',
      };

      // First registration should succeed
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email should fail
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('should reject login with incorrect password', async () => {
      const userData = {
        name: 'Test User',
        email: 'wrongpass@test.com',
        password: 'Password123!',
      };

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to login with wrong password
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid');
    });

    it('should reject login for non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Password123!',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid');
    });
  });

  describe('Role-Based Access Control', () => {
    it('should allow admin to access admin routes', async () => {
      // Create admin user
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'Password123!',
        role: 'admin',
      });

      // Login as admin
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'Password123!',
        })
        .expect(200);

      const cookies = loginRes.headers['set-cookie'];

      // Access admin route
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Cookie', cookies)
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should prevent regular user from accessing admin routes', async () => {
      // Create regular user
      await User.create({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'Password123!',
        role: 'user',
      });

      // Login as regular user
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'Password123!',
        })
        .expect(200);

      const cookies = loginRes.headers['set-cookie'];

      // Try to access admin route
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Cookie', cookies)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not authorized');
    });
  });

  describe('Blocked User Handling', () => {
    it('should prevent blocked user from logging in', async () => {
      // Create and block user
      const user = await User.create({
        name: 'Blocked User',
        email: 'blocked@test.com',
        password: 'Password123!',
        role: 'user',
        isBlocked: true,
      });

      // Try to login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'blocked@test.com',
          password: 'Password123!',
        })
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('blocked');
    });
  });
});
