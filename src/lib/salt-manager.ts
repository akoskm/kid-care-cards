import { supabase } from './supabase';

// Singleton pattern for salt management
export class SaltManager {
  private static instance: SaltManager;
  private saltCache: Map<string, Promise<string>> = new Map();

  private constructor() {}

  public static getInstance(): SaltManager {
    if (!SaltManager.instance) {
      SaltManager.instance = new SaltManager();
    }
    return SaltManager.instance;
  }

  public async getUserSalt(userId: string): Promise<string> {
    // If we already have a promise for this salt, return it
    if (this.saltCache.has(userId)) {
      return this.saltCache.get(userId)!;
    }

    // Create a new promise for fetching the salt
    const saltPromise = (async () => {
      const { data: saltData, error } = await supabase
        .from('user_salts')
        .select('salt')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Failed to retrieve encryption salt:', error);
        throw new Error('Failed to retrieve encryption salt');
      }

      if (!saltData) {
        throw new Error('No salt data found');
      }

      return saltData.salt;
    })();

    // Store the promise in the cache
    this.saltCache.set(userId, saltPromise);

    // Return the promise
    return saltPromise;
  }

  public clearUserSalt(userId: string): void {
    this.saltCache.delete(userId);
  }
}

// Export singleton instance
export const saltManager = SaltManager.getInstance();