import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { websiteService } from "../services/websiteService";
import { imageService } from "../services/imageService";
import { WebsiteLinkInput } from "../types";
import SuccessModal from "../components/SuccessModal";
import { ArrowLeft, Save, Link as LinkIcon, Upload } from "lucide-react";

const AddLink = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedWebsite, setSavedWebsite] = useState<{
    name: string;
    url: string;
    isFavorite: boolean;
  } | null>(null);
  const [formData, setFormData] = useState<WebsiteLinkInput>({
    name: "",
    url: "",
    imageUrl: "",
    description: "",
    category: "",
    isFavorite: false,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.url.trim()) {
      alert("Please fill in the required fields");
      return;
    }

    try {
      setLoading(true);

      // Upload image if file is selected
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        console.log("Converting image to Base64...");
        imageUrl = await imageService.uploadImage(imageFile, formData.name);
        console.log("Base64 conversion successful! Length:", imageUrl.length);
      }

      console.log("Saving to Firestore...");
      // Add website with uploaded image URL
      await websiteService.addWebsite({
        ...formData,
        imageUrl,
      });

      console.log("Website saved successfully!");

      // Show success modal with website details
      setSavedWebsite({
        name: formData.name,
        url: formData.url,
        isFavorite: formData.isFavorite || false,
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding website:", error);
      alert(
        `Failed to add website: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      url: "",
      imageUrl: "",
      description: "",
      category: "",
      isFavorite: false,
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleViewWebsite = () => {
    if (savedWebsite) {
      window.open(savedWebsite.url, "_blank");
    }
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSavedWebsite(null);
    handleReset();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Add New Website
          </h1>
          <p className="text-gray-600">
            Save a new website link to your collection
          </p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Website Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Name *
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g., GitHub, Google, Netflix"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL *
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  required
                  className="input-field pl-10"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Include the full URL with https://
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image / Logo
              </label>

              {/* File Upload */}
              <div className="mb-3">
                <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (MAX. 5MB)
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

              {/* Image Preview */}
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
                placeholder="https://example.com/logo.png"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional: Upload an image or provide a URL for the website
                thumbnail
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Social Media, Development, News, Entertainment"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
              <p className="mt-1 text-sm text-gray-500">
                Organize your links by category
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description / Notes
              </label>
              <textarea
                className="input-field resize-none"
                rows={5}
                placeholder="Add any notes or description about this website..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Favorite Checkbox */}
            <div className="flex items-center">
              <input
                id="favorite"
                type="checkbox"
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                checked={formData.isFavorite}
                onChange={(e) =>
                  setFormData({ ...formData, isFavorite: e.target.checked })
                }
              />
              <label
                htmlFor="favorite"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Add to Favorites
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? "Saving..." : "Save Website"}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Pro Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Use descriptive names to easily find your websites later</li>
            <li>• Categories help organize and filter your links quickly</li>
            <li>• Add notes to remember why you saved a particular website</li>
            <li>• Mark important sites as favorites for quick access</li>
          </ul>
        </div>
      </div>

      {/* Success Modal */}
      {savedWebsite && (
        <SuccessModal
          isVisible={showSuccessModal}
          onClose={handleCloseSuccessModal}
          websiteName={savedWebsite.name}
          websiteUrl={savedWebsite.url}
          isFavorite={savedWebsite.isFavorite}
          onViewWebsite={handleViewWebsite}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
};

export default AddLink;
