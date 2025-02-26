// Helper functions to interact with device storage through Expo WebView

interface ExpoStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

declare global {
  interface Window {
    ExpoStorage?: ExpoStorage;
  }
}

export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (window.ExpoStorage) {
        return await window.ExpoStorage.getItem(key);
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (window.ExpoStorage) {
        await window.ExpoStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Error setting item in storage:", error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      if (window.ExpoStorage) {
        await window.ExpoStorage.removeItem(key);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  },
};
