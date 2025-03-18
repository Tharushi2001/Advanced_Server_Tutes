// services/authService.js
const bcrypt = require('bcrypt');
const authDAO = require('../dao/authDAO');
const { generateTokens } = require('../config/jwt');

class AuthService {
    async login(email, password) {
        try {
            const user = await authDAO.findUserByEmail(email);
            if (!user) {
                return null;
            }

            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );

            if (!isValidPassword) {
                return null;
            }

            // Generate both JWT and CSRF tokens
            const { accessToken, csrfToken } = generateTokens(user);

            // Remove sensitive data
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;

            return {
                accessToken,
                csrfToken,
                user: userWithoutPassword
            };
        } catch (error) {
            throw new Error(`Login error: ${error.message}`);
        }
    }

    async register(userData) {
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;

            // Create user
            const userId = await authDAO.createUser(userData);
            const user = await authDAO.findUserById(userId);

            // Generate tokens
            const { accessToken, csrfToken } = generateTokens(user);

            // Remove sensitive data
            delete user.password;

            return {
                accessToken,
                csrfToken,
                user
            };
        } catch (error) {
            throw new Error(`Registration error: ${error.message}`);
        }
    }
}