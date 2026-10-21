export const imageService = {
  // Convert image file to base64 data URL for local storage
  async uploadImage(file: File, websiteName: string): Promise<string> {
    try {
      // Convert file to base64 data URL
      const base64 = await this.fileToBase64(file);
      return base64;
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    }
  },

  // Convert file to base64 data URL
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  },
};
