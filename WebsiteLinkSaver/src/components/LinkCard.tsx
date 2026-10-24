import { ExternalLink, Trash2, Edit, Heart } from "lucide-react";
import { WebsiteLink } from "../types";
import { isIconImage } from "../utils/links";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

interface LinkCardProps {
  website: WebsiteLink;
  onDelete: (id: string) => void;
  onEdit: (website: WebsiteLink) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

const LinkCard = ({
  website,
  onDelete,
  onEdit,
  onToggleFavorite,
}: LinkCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleVisit = () => {
    const url = website.url.startsWith("http")
      ? website.url
      : `https://${website.url}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const domain = websiteDomain(website.url);
  const showImage = Boolean(website.imageUrl) && !imageError;
  const showIcon = showImage && isIconImage(website.imageUrl);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(website.id);
  };

  return (
    <div className="card group flex h-full flex-col overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
        {showIcon && (
          <div className="flex h-full items-center justify-center">
            <img
              src={website.imageUrl}
              alt=""
              className="h-16 w-16 rounded-2xl bg-white object-contain p-2 shadow-sm"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        {showImage && !showIcon && (
          <img
            src={website.imageUrl}
            alt=""
            className="h-full w-full object-cover object-top"
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />
        )}
        <button
          onClick={() => onToggleFavorite(website.id, !website.isFavorite)}
          className={`absolute top-3 right-3 rounded-full p-2 shadow-md ring-2 ring-white transition-all duration-200 ${
            website.isFavorite
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700 hover:text-red-500"
          }`}
          title={website.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className="w-5 h-5"
            fill={website.isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
          {website.name}
        </h3>
        {website.category.trim() && (
          <p
            className="mt-2 w-fit max-w-full truncate rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
            title={website.category}
          >
            {website.category}
          </p>
        )}
        <p
          className={`line-clamp-1 text-xs text-gray-500 ${
            website.category.trim() ? "mb-2 mt-1" : "mb-2"
          }`}
        >
          {domain}
        </p>
        <p className="mb-4 min-h-[2.5rem] line-clamp-2 text-sm text-gray-600">
          {website.description || "No description provided"}
        </p>

        <div className="mt-auto flex space-x-2">
          <button
            onClick={handleVisit}
            className="flex-1 btn-primary flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Visit</span>
          </button>
          <button
            onClick={() => onEdit(website)}
            className="rounded-lg bg-gray-200 p-2 text-gray-700 transition-opacity hover:bg-gray-300 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="rounded-lg bg-red-100 p-2 text-red-600 transition-opacity hover:bg-red-200 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isVisible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Website"
        message="Are you sure you want to delete this website? This action cannot be undone."
        itemName={website.name}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </div>
  );
};

function websiteDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default LinkCard;
