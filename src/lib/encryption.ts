import CryptoJS from 'crypto-js';

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
export const encryptData = (data: unknown, userId: string): string => {
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

// Decrypt data with proper error handling and validation
export const decryptData = (encryptedData: string, userId: string): unknown => {
  try {
    const key = deriveEncryptionKey(userId);
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error('Decryption produced empty result');
    }

    const parsed = JSON.parse(decryptedString);

    // Validate the decrypted data structure
    if (!parsed.version || !parsed.timestamp || !parsed.data) {
      throw new Error('Invalid encrypted data format');
    }

    // Parse the actual data
    return JSON.parse(parsed.data);
  } catch (error) {
    console.error('Decryption failed:', error);

    // Return null for invalid/corrupted data instead of throwing
    // This allows the application to handle missing/corrupt data gracefully
    return null;
  }
};

// Encrypt specific fields in an object
export const encryptFields = <T extends Record<string, unknown>>(
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

// Decrypt specific fields in an object
export const decryptFields = <T extends Record<string, unknown>>(
  data: T,
  fieldsToDecrypt: readonly (keyof T)[],
  userId: string
): T => {
  try {
    const decryptedData = { ...data };

    for (const field of fieldsToDecrypt) {
      if (data[field] !== undefined && data[field] !== null) {
        const decrypted = decryptData(data[field] as string, userId);
        // Only update the field if decryption was successful
        if (decrypted !== null) {
          decryptedData[field] = decrypted as T[typeof field];
        }
      }
    }

    return decryptedData;
  } catch (error) {
    console.error('Field decryption failed:', error);
    // Return original data if decryption fails
    return data;
  }
};
