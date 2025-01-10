import crypto from 'crypto'; // Import the crypto module

// Function to generate a secure encryption key
export const generateEncryptionKey = (length) => {
  return crypto.randomBytes(length/2).toString('hex'); // Generate random bytes and convert to hexadecimal string
};


