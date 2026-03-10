const fc = require('fast-check');
const User = require('../../models/User');

describe('User Model Property-Based Tests', () => {
  describe('Property 1: User Registration Creates Hashed Account', () => {
    it('should always hash passwords regardless of input', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 8, maxLength: 100 }),
          async (password) => {
            // Skip if password doesn't meet validation requirements
            if (password.length < 8) return true;

            const user = new User({
              name: 'Property Test User',
              email: `test-${Date.now()}-${Math.random()}@example.com`,
              password: password,
              role: 'user',
            });

            await user.save();

            // Property: Password should always be hashed (not equal to original)
            expect(user.password).not.toBe(password);
            
            // Property: Hashed password should match bcrypt pattern
            expect(user.password).toMatch(/^\$2[aby]\$.{56}$/);

            // Property: comparePassword should return true for original password
            const isMatch = await user.comparePassword(password);
            expect(isMatch).toBe(true);

            return true;
          }
        ),
        { numRuns: 10 } // Run 10 times with different passwords
      );
    });
  });

  describe('Property 4: Duplicate Email Registration Rejected', () => {
    it('should always reject duplicate emails', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 8, maxLength: 50 }),
          async (email, name, password) => {
            // Create first user
            try {
              await User.create({
                name: name,
                email: email,
                password: password,
              });

              // Try to create second user with same email
              let error;
              try {
                await User.create({
                  name: 'Different Name',
                  email: email,
                  password: 'DifferentPassword123!',
                });
              } catch (err) {
                error = err;
              }

              // Property: Duplicate email should always cause error
              expect(error).toBeDefined();
              expect(error.code).toBe(11000);

              return true;
            } catch (err) {
              // If first user creation fails (validation), skip this test case
              if (err.name === 'ValidationError') {
                return true;
              }
              throw err;
            }
          }
        ),
        { numRuns: 5 }
      );
    });
  });

  describe('Property 7: User Role Assignment Validity', () => {
    it('should only accept valid role values', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('user', 'vendor', 'admin'),
          async (role) => {
            const user = new User({
              name: 'Role Test User',
              email: `role-test-${Date.now()}-${Math.random()}@example.com`,
              password: 'Password123!',
              role: role,
            });

            await user.save();

            // Property: Role should be one of the valid values
            expect(['user', 'vendor', 'admin']).toContain(user.role);
            expect(user.role).toBe(role);

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should reject invalid role values', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string().filter(s => !['user', 'vendor', 'admin'].includes(s)),
          async (invalidRole) => {
            const user = new User({
              name: 'Invalid Role Test',
              email: `invalid-${Date.now()}-${Math.random()}@example.com`,
              password: 'Password123!',
              role: invalidRole,
            });

            let error;
            try {
              await user.save();
            } catch (err) {
              error = err;
            }

            // Property: Invalid role should always cause validation error
            if (invalidRole !== '') {
              expect(error).toBeDefined();
              expect(error.name).toBe('ValidationError');
            }

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Property 5: Invalid Email Format Rejected', () => {
    it('should reject invalid email formats', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string().filter(s => !s.includes('@') || !s.includes('.')),
          async (invalidEmail) => {
            // Skip empty strings
            if (!invalidEmail) return true;

            const user = new User({
              name: 'Email Test User',
              email: invalidEmail,
              password: 'Password123!',
            });

            let error;
            try {
              await user.save();
            } catch (err) {
              error = err;
            }

            // Property: Invalid email should cause validation error
            expect(error).toBeDefined();
            expect(error.name).toBe('ValidationError');
            expect(error.errors.email).toBeDefined();

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  });

  describe('Property 6: Short Password Rejected', () => {
    it('should reject passwords shorter than 8 characters', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ maxLength: 7 }),
          async (shortPassword) => {
            const user = new User({
              name: 'Password Test User',
              email: `pwd-test-${Date.now()}-${Math.random()}@example.com`,
              password: shortPassword,
            });

            let error;
            try {
              await user.save();
            } catch (err) {
              error = err;
            }

            // Property: Short password should always cause validation error
            expect(error).toBeDefined();
            expect(error.name).toBe('ValidationError');
            expect(error.errors.password).toBeDefined();

            return true;
          }
        ),
        { numRuns: 10 }
      );
    });
  });
});
