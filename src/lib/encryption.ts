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
export const encryptData = async (data: unknown, userId: string): Promise<string> => {
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

// Decrypt data using Web Crypto API
export const decryptData = async (encryptedData: string, userId: string): Promise<unknown> => {
  try {
    // Decode base64
    const decodedData = atob(encryptedData);
    const dataArray = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      dataArray[i] = decodedData.charCodeAt(i);
    }

    const key = await deriveEncryptionKey(userId);

    // Extract IV (first 12 bytes) and encrypted data
    const iv = dataArray.slice(0, 12);
    const encryptedContent = dataArray.slice(12);

    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encryptedContent
    );

    const decryptedString = new TextDecoder().decode(decryptedBuffer);
    const parsed = JSON.parse(decryptedString);

    // Validate the decrypted data structure
    if (!parsed.version || !parsed.timestamp || !parsed.data) {
      throw new Error('Invalid encrypted data format');
    }

    // Parse the actual data
    return JSON.parse(parsed.data);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

// Encrypt specific fields in an object
export const encryptFields = async <T extends Record<string, unknown>>(
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

// Decrypt specific fields in an object
export const decryptFields = async <T extends Record<string, unknown>>(
  data: T,
  fieldsToDecrypt: readonly (keyof T)[],
  userId: string
): Promise<T> => {
  try {
    const decryptedData = { ...data };

    for (const field of fieldsToDecrypt) {
      if (data[field] !== undefined && data[field] !== null) {
        const decrypted = await decryptData(data[field] as string, userId);
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
