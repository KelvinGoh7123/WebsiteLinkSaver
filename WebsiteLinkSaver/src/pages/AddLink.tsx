import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { websiteService } from "../services/websiteService";
import { imageService } from "../services/imageService";
import { lookupPage } from "../services/metadataService";
import { WebsiteLink, WebsiteLinkInput } from "../types";
import SuccessModal from "../components/SuccessModal";
import CategoryField, { useSavedCategories } from "../components/CategoryField";
import ImagePicker from "../components/ImagePicker";
import { useWebsites } from "../context/WebsiteContext";
import {
  ensureHttps,
  faviconUrl,
  findSavedWebsite,
  getLastCategory,
  looksLikeUrl,
  normalizeImageUrl,
  rememberCategory,
  resolveCategory,
} from "../utils/links";
import { ArrowLeft, Save, Link as LinkIcon } from "lucide-react";

const AddLink = () => {
  const navigate = useNavigate();
  const { websites } = useWebsites();
  const categories = useSavedCategories();
  const [loading, setLoading] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [duplicate, setDuplicate] = useState<WebsiteLink | null>(null);
  const websitesRef = useRef(websites);
  const imageFileRef = useRef<File | null>(null);
  websitesRef.current = websites;
  const [imageFile, setImageFile] = useState<File | null>(null);
  imageFileRef.current = imageFile;
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
    category: getLastCategory(),
    isFavorite: false,
  });

  useEffect(() => {
    if (!looksLikeUrl(formData.url)) {
      setDuplicate(null);
      setLookingUp(false);
      return;
    }

    const normalized = ensureHttps(formData.url);
    const existing = findSavedWebsite(normalized, websitesRef.current);
    setDuplicate(existing ?? null);
    if (existing) {
      setLookingUp(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      if (findSavedWebsite(normalized, websitesRef.current)) return;
      setLookingUp(true);
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      lookupPage(normalized, controller.signal)
        .then((metadata) => {
          window.clearTimeout(timeout);
          if (!metadata || controller.signal.aborted) return;
          setFormData((current) => ({
            ...current,
            name: current.name.trim() ? current.name : metadata.title,
            description: current.description.trim()
              ? current.description
              : metadata.description,
            imageUrl:
              imageFileRef.current || current.imageUrl.trim()
                ? current.imageUrl
                : metadata.imageUrl,
          }));
        })
        .finally(() => {
          if (!controller.signal.aborted) setLookingUp(false);
        });
    }, 500);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [formData.url]);

  const handleFileChange = (file: File | null) => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.url.trim()) {
      alert("Please fill in the required fields");
      return;
    }

    const url = ensureHttps(formData.url);
    const existing = findSavedWebsite(url, websites);
    if (existing) {
      setDuplicate(existing);
      return;
    }

    try {
      setLoading(true);

      const imageUrl = imageFile
        ? await imageService.uploadImage(imageFile)
        : normalizeImageUrl(formData.imageUrl) || faviconUrl(url);
      const category = resolveCategory(formData.category, categories);

      await websiteService.addWebsite({
        ...formData,
        name: formData.name.trim(),
        url,
        imageUrl,
        category,
        description: formData.description.trim(),
      });
      rememberCategory(category);

      setSavedWebsite({
        name: formData.name.trim(),
        url,
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
    setDuplicate(null);
    handleFileChange(null);
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
                  type="text"
                  inputMode="url"
                  required
                  className="input-field pl-10"
                  placeholder="example.com"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                https:// is added automatically if you leave it out
              </p>
              {lookingUp && (
                <p className="mt-1 text-sm text-gray-500">Looking up the page…</p>
              )}
              {duplicate && (
                <p className="mt-1 text-sm text-amber-700">
                  Already saved as {duplicate.name}.
                </p>
              )}
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
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || lookingUp || Boolean(duplicate)}
                className="btn-primary flex items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? "Saving..." : "Save Website"}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-50"
                disabled={loading}
              >
                Reset form
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
