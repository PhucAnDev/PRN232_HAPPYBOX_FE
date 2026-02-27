// Cloudinary Upload Service
// Free tier: 25GB storage, 25GB bandwidth/month
// No API key needed with unsigned upload preset

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

class UploadService {
  // TODO: Replace with your Cloudinary credentials
  // Get free account at: https://cloudinary.com/users/register_free
  private cloudName = "dn25cy6bo"; // Replace with your cloud_name
  private uploadPreset = "happybox_unsigned"; // Replace with your unsigned upload preset

  /**
   * Upload image to Cloudinary
   * @param file - File object from input
   * @returns Promise with image URL
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", this.uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data: CloudinaryResponse = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  }

  /**
   * Upload multiple images in parallel
   * @param files - Array of File objects
   * @returns Promise with array of image URLs
   */
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Multiple upload error:", error);
      throw error;
    }
  }

  /**
   * Setup instructions for Cloudinary
   */
  static getSetupInstructions(): string {
    return `
🔧 SETUP CLOUDINARY (2 phút):

1. Đăng ký free tại: https://cloudinary.com/users/register_free
2. Sau khi đăng nhập, vào Settings → Upload
3. Scroll xuống "Upload presets"
4. Click "Add upload preset"
5. Set:
   - Preset name: happybox_unsigned
   - Signing Mode: Unsigned
   - Folder: products (optional)
6. Click Save
7. Copy Cloud Name từ Dashboard
8. Update uploadService.ts:
   - cloudName = "your_cloud_name"
   - uploadPreset = "happybox_unsigned"

✅ Xong! Free tier: 25GB storage, không cần API key
    `;
  }
}

export const uploadService = new UploadService();
export default uploadService;
