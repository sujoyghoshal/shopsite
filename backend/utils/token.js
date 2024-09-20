const jwt = require('jsonwebtoken');

// Function to create a new JWT token
const createNewToken = (payload) => {
    return jwt.sign({ userId: payload }, process.env.SECRET_KEY, { expiresIn: '10d' });
};

module.exports = { createNewToken };
