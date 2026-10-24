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
    <div className="card flex h-full flex-col overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
        {showIcon && (
          <div className="flex h-full items-start justify-center pt-8">
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
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 pb-3 pt-12">
          <h3 className="line-clamp-1 text-lg font-semibold text-white">
            {website.name}
          </h3>
          <p className="line-clamp-1 text-xs text-white/80">{domain}</p>
        </div>
        <button
          onClick={() => onToggleFavorite(website.id, !website.isFavorite)}
          className={`absolute top-3 right-3 rounded-full p-2 shadow-sm transition-all duration-200 ${
            website.isFavorite
              ? "bg-red-500 text-white"
              : "bg-white text-gray-600 hover:text-red-500"
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
        <p className="mb-4 min-h-[2.5rem] line-clamp-2 text-sm text-gray-600">
          {website.description || "No description provided"}
        </p>

        {/* Action Buttons */}
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
            className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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
