// Key derivation function using Web Crypto API
const deriveEncryptionKey = async (userId: string): Promise<CryptoKey> => {
  if (!userId) {
    throw new Error('No user ID available');
  }

  const salt = 'e10adc3949ba59abbe56e057f20f883e'; // MD5 hash for additional security

  // Convert userId and salt to Uint8Array
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(userId),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 1000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

// Encrypt data with Web Crypto API
const encryptData = async (data: unknown, userId: string): Promise<string> => {
  try {
    const key = await deriveEncryptionKey(userId);
    const jsonString = JSON.stringify(data);

    // Add a version and timestamp to the encrypted data
    const dataToEncrypt = {
      version: 1,
      timestamp: Date.now(),
      data: jsonString
    };

    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      new TextEncoder().encode(JSON.stringify(dataToEncrypt))
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Encrypt specific fields in an object
export const encryptObjectFields = async <T extends Record<string, unknown>>(
  data: T,
  fieldsToEncrypt: readonly (keyof T)[],
  userId: string
): Promise<T> => {
  try {
    const encryptedData = { ...data };

    for (const field of fieldsToEncrypt) {
      if (data[field] !== undefined && data[field] !== null) {
        encryptedData[field] = await encryptData(data[field], userId) as T[typeof field];
      }
    }

    return encryptedData;
  } catch (error) {
    console.error('Field encryption failed:', error);
    throw new Error('Failed to encrypt fields');
  }
};
