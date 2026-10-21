import { useState } from "react";
import { Upload } from "lucide-react";
import { MAX_IMAGE_UPLOAD_BYTES } from "../services/imageService";

interface ImagePickerProps {
  imageUrl: string;
  previewUrl: string;
  onImageUrlChange: (url: string) => void;
  onFileChange: (file: File | null) => void;
}

const ImagePicker = ({
  imageUrl,
  previewUrl,
  onImageUrlChange,
  onFileChange,
}: ImagePickerProps) => {
  const [dragging, setDragging] = useState(false);
  const hasFile = Boolean(previewUrl);
  const storedUrl = imageUrl.trim();
  const isDataImage = storedUrl.startsWith("data:");
  const showDropzone = !hasFile && !storedUrl;
  const showUrlField = !hasFile && !isDataImage;
  const showPreview =
    hasFile || isDataImage || storedUrl.startsWith("http");

  const acceptFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      alert(
        `Image is too large! Please use an image smaller than 8MB.\nCurrent size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      return;
    }
    onImageUrlChange("");
    onFileChange(file);
  };

  const useUrlInstead = () => {
    onFileChange(null);
    if (storedUrl.startsWith("data:")) {
      onImageUrlChange("");
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Image / Logo
      </label>

      {showPreview && (
        <img
          src={hasFile ? previewUrl : storedUrl}
          alt="Selected thumbnail"
          className="mb-3 h-48 w-full rounded-lg border border-gray-300 object-cover object-top"
        />
      )}

      {hasFile && (
        <button
          type="button"
          onClick={useUrlInstead}
          className="mb-3 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          Use an image URL instead
        </button>
      )}

      {!hasFile && storedUrl && (
        <button
          type="button"
          onClick={() => onImageUrlChange("")}
          className="mb-3 block text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {isDataImage ? "Remove image" : "Upload a file instead"}
        </button>
      )}

      {showDropzone && (
        <label
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            acceptFile(event.dataTransfer.files?.[0]);
          }}
          className={`flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 transition ${
            dragging
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload className="mb-3 h-10 w-10 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag
              and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, or WEBP up to 8MB. Photos are resized
              automatically.
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(event) => {
              acceptFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
      )}

      {showUrlField && (
        <>
          {showDropzone && (
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or enter URL
                </span>
              </div>
            </div>
          )}
          <input
            type="text"
            inputMode="url"
            className="input-field"
            placeholder="https://example.com/logo.png"
            value={isDataImage ? "" : imageUrl}
            onChange={(event) => onImageUrlChange(event.target.value)}
          />
        </>
      )}
    </div>
  );
};

export default ImagePicker;
