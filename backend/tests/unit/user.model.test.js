const User = require('../../models/User');

describe('User Model Unit Tests', () => {
  describe('User Schema Validation', () => {
    it('should create a valid user with all required fields', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'user',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.isBlocked).toBe(false);
      expect(savedUser.cart).toEqual([]);
      expect(savedUser.wishlist).toEqual([]);
    });

    it('should fail validation without required fields', async () => {
      const user = new User({});
      
      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it('should fail validation with invalid email format', async () => {
      const user = new User({
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123!',
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.email).toBeDefined();
    });

    it('should fail validation with short password', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: '12345',
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(error.errors.password).toBeDefined();
    });

    it('should default role to "user" if not specified', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const savedUser = await user.save();
      expect(savedUser.role).toBe('user');
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'Password123!',
      };

      await User.create(userData);

      let error;
      try {
        await User.create(userData);
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    });
  });

  describe('User Methods', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'Password123!';
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: plainPassword,
      });

      await user.save();

      expect(user.password).not.toBe(plainPassword);
      expect(user.password).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash pattern
    });

    it('should compare password correctly', async () => {
      const plainPassword = 'Password123!';
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: plainPassword,
      });

      await user.save();

      const isMatch = await user.comparePassword(plainPassword);
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword('WrongPassword');
      expect(isNotMatch).toBe(false);
    });

    it('should not rehash password if not modified', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      await user.save();
      const firstHash = user.password;

      user.name = 'Updated Name';
      await user.save();

      expect(user.password).toBe(firstHash);
    });
  });
});
