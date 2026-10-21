import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { WebsiteLink, WebsiteLinkInput } from "../types";
import { imageService } from "../services/imageService";
import Notification from "./Notification";

interface EditModalProps {
  website: WebsiteLink;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<WebsiteLinkInput>) => void;
  onSuccess?: (message: string) => void;
}

const EditModal = ({
  website,
  isOpen,
  onClose,
  onSave,
  onSuccess,
}: EditModalProps) => {
  const [formData, setFormData] = useState<WebsiteLinkInput>({
    name: website.name,
    url: website.url,
    imageUrl: website.imageUrl,
    description: website.description,
    category: website.category,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: website.name,
        url: website.url,
        imageUrl: website.imageUrl,
        description: website.description,
        category: website.category,
      });
      setImageFile(null);
      setImagePreview("");
    }
  }, [isOpen, website]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 1MB for Base64)
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        alert(
          `Image is too large! Please use an image smaller than 1MB.\nCurrent size: ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB\nRecommended: Compress or resize the image.`
        );
        return;
      }

      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUploading(true);

      // Upload image if file is selected
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        console.log("Converting image to Base64...");
        imageUrl = await imageService.uploadImage(imageFile, formData.name);
        console.log("Base64 conversion successful! Length:", imageUrl.length);
      }

      console.log("Saving to Firestore...");
      onSave(website.id, {
        ...formData,
        imageUrl,
      });

      // Show success notification
      setNotificationMessage("Website updated successfully!");
      setShowNotification(true);

      // Close modal after a short delay to show the notification
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess("Website updated successfully!");
        }
      }, 1000);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Notification
        message={notificationMessage}
        type="success"
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Edit Website</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Name *
              </label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL *
              </label>
              <input
                type="url"
                required
                className="input-field"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image / Logo
              </label>

              {/* Current Image Preview */}
              {!imagePreview && formData.imageUrl && (
                <div className="mb-3">
                  <img
                    src={formData.imageUrl}
                    alt="Current"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}

              {/* File Upload */}
              <div className="mb-3">
                <label className="flex items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> new
                      image
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* New Image Preview */}
              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}

              {/* Or Enter URL */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or enter URL
                  </span>
                </div>
              </div>

              <input
                type="url"
                className="input-field mt-3"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Social Media, Tools, News"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="input-field resize-none"
                rows={4}
                placeholder="Add a brief description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditModal;
