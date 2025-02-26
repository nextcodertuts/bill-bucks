// Bridge to communicate between Next.js and Expo native features

interface ExpoBridge {
  requestCameraPermission?: () => Promise<boolean>;
  requestStoragePermission?: () => Promise<boolean>;
  pickImage?: () => Promise<{ uri: string; base64: string } | null>;
  saveImage?: (base64: string) => Promise<string>;
}

declare global {
  interface Window {
    ExpoBridge?: ExpoBridge;
  }
}

export const expo = {
  requestCameraPermission: async (): Promise<boolean> => {
    try {
      if (window.ExpoBridge?.requestCameraPermission) {
        return await window.ExpoBridge.requestCameraPermission();
      }
      return true; // Default to true in web environment
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      return false;
    }
  },

  requestStoragePermission: async (): Promise<boolean> => {
    try {
      if (window.ExpoBridge?.requestStoragePermission) {
        return await window.ExpoBridge.requestStoragePermission();
      }
      return true; // Default to true in web environment
    } catch (error) {
      console.error("Error requesting storage permission:", error);
      return false;
    }
  },

  pickImage: async (): Promise<{ uri: string; base64: string } | null> => {
    try {
      if (window.ExpoBridge?.pickImage) {
        return await window.ExpoBridge.pickImage();
      }
      return null;
    } catch (error) {
      console.error("Error picking image:", error);
      return null;
    }
  },

  saveImage: async (base64: string): Promise<string> => {
    try {
      if (window.ExpoBridge?.saveImage) {
        return await window.ExpoBridge.saveImage(base64);
      }
      throw new Error("Save image not supported in web environment");
    } catch (error) {
      console.error("Error saving image:", error);
      throw error;
    }
  },
};
