import CryptoJS from 'crypto-js';
import {
  encryptData,
  decryptData,
  encryptFields,
  decryptFields,
} from './encryption';

export const encrypt = (data: unknown, userId: string): string => {
  return encryptData(data, userId, CryptoJS);
};

export const decrypt = (encryptedData: string, userId: string): unknown => {
  return decryptData(encryptedData, userId, CryptoJS);
};

export const encryptObjectFields = <T extends Record<string, unknown>>(
  data: T,
  fieldsToEncrypt: readonly (keyof T)[],
  userId: string
): T => {
  return encryptFields(data, fieldsToEncrypt, userId, CryptoJS);
};

export const decryptObjectFields = <T extends Record<string, unknown>>(
  data: T,
  fieldsToDecrypt: readonly (keyof T)[],
  userId: string
): T => {
  return decryptFields(data, fieldsToDecrypt, userId, CryptoJS);
};