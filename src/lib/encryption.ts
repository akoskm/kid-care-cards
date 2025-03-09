import CryptoJS from 'crypto-js';
import { supabase } from './supabase';

// Key derivation function to generate encryption key from user's UUID
const deriveEncryptionKey = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) {
    throw new Error('No user ID available');
  }

  // Use only the user's UUID for key derivation with a random MD5 hash as salt
  // This is stable and doesn't change between sessions
  const salt = 'e10adc3949ba59abbe56e057f20f883e'; // MD5 hash for additional security
  
  return CryptoJS.PBKDF2(session.user.id, salt, {
    keySize: 256 / 32,
    iterations: 1000
  }).toString();
};

// Encrypt data with proper error handling
export const encryptData = async (data: unknown): Promise<string> => {
  try {
    const key = await deriveEncryptionKey();
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
export const decryptData = async (encryptedData: string): Promise<unknown> => {
  try {
    const key = await deriveEncryptionKey();
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
export const encryptFields = async <T extends Record<string, unknown>>(
  data: T,
  fieldsToEncrypt: readonly (keyof T)[]
): Promise<T> => {
  try {
    const encryptedData = { ...data };

    for (const field of fieldsToEncrypt) {
      if (data[field] !== undefined && data[field] !== null) {
        encryptedData[field] = await encryptData(data[field]) as T[typeof field];
      }
    }

    return encryptedData;
  } catch (error) {
    console.error('Field encryption failed:', error);
    throw new Error('Failed to encrypt fields');
  }
};

// Decrypt specific fields in an object
export const decryptFields = async <T extends Record<string, unknown>>(
  data: T,
  fieldsToDecrypt: readonly (keyof T)[]
): Promise<T> => {
  try {
    const decryptedData = { ...data };

    for (const field of fieldsToDecrypt) {
      if (data[field] !== undefined && data[field] !== null) {
        const decrypted = await decryptData(data[field] as string);
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
