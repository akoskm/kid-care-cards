import CryptoJS from 'https://esm.sh/crypto-js@4.2.0';

// Key derivation function to generate encryption key from user's UUID
const deriveEncryptionKey = (userId: string): string => {
  if (!userId) {
    throw new Error('No user ID available');
  }

  // Use only the user's UUID for key derivation with a random MD5 hash as salt
  // This is stable and doesn't change between sessions
  const salt = 'e10adc3949ba59abbe56e057f20f883e'; // MD5 hash for additional security

  return CryptoJS.PBKDF2(userId, salt, {
    keySize: 256 / 32,
    iterations: 1000
  }).toString();
};

// Encrypt data with proper error handling
const encryptData = (data: unknown, userId: string): string => {
  try {
    const key = deriveEncryptionKey(userId);
    const jsonString = JSON.stringify(data);

    // Add a version and timestamp to the encrypted data
    const dataToEncrypt = {
      version: 1,
      timestamp: Date.now(),
      data: jsonString
    };

    return CryptoJS.AES.encrypt(JSON.stringify(dataToEncrypt), key).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Encrypt specific fields in an object
export const encryptObjectFields = <T extends Record<string, unknown>>(
  data: T,
  fieldsToEncrypt: readonly (keyof T)[],
  userId: string
): T => {
  try {
    const encryptedData = { ...data };

    for (const field of fieldsToEncrypt) {
      if (data[field] !== undefined && data[field] !== null) {
        encryptedData[field] = encryptData(data[field], userId) as T[typeof field];
      }
    }

    return encryptedData;
  } catch (error) {
    console.error('Field encryption failed:', error);
    throw new Error('Failed to encrypt fields');
  }
};
