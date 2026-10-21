import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { WebsiteLink, WebsiteLinkInput } from "../types";
import { imageService } from "../services/imageService";
import Notification from "./Notification";
import CategoryField, { useSavedCategories } from "./CategoryField";
import ImagePicker from "./ImagePicker";
import { ensureHttps, normalizeImageUrl, resolveCategory } from "../utils/links";

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
  const categories = useSavedCategories();
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
      setImagePreview((current) => {
        if (current.startsWith("blob:")) URL.revokeObjectURL(current);
        return "";
      });
    }
  }, [isOpen, website]);

  const handleFileChange = (file: File | null) => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUploading(true);

      // Upload image if file is selected
      const imageUrl = imageFile
        ? await imageService.uploadImage(imageFile)
        : normalizeImageUrl(formData.imageUrl);

      onSave(website.id, {
        ...formData,
        name: formData.name.trim(),
        url: ensureHttps(formData.url),
        imageUrl,
        category: resolveCategory(formData.category, categories),
        description: formData.description.trim(),
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
                type="text"
                inputMode="url"
                required
                className="input-field"
                placeholder="example.com"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
              />
              <p className="mt-1 text-sm text-gray-500">
                https:// is added automatically if you leave it out
              </p>
            </div>

            <ImagePicker
              imageUrl={formData.imageUrl}
              previewUrl={imagePreview}
              onImageUrlChange={(imageUrl) =>
                setFormData({ ...formData, imageUrl })
              }
              onFileChange={handleFileChange}
            />

            <CategoryField
              value={formData.category}
              onChange={(category) => setFormData({ ...formData, category })}
            />

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

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-50"
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
