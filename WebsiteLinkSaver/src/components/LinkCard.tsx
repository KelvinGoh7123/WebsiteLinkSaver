import { ExternalLink, Trash2, Edit, Heart } from "lucide-react";
import { WebsiteLink } from "../types";
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

  const defaultImage =
    "https://via.placeholder.com/400x200/0ea5e9/ffffff?text=No+Image";

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(website.id);
  };

  return (
    <div className="card overflow-hidden group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={imageError ? defaultImage : website.imageUrl || defaultImage}
          alt={website.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
        />
        <button
          onClick={() => onToggleFavorite(website.id, !website.isFavorite)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            website.isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-600 hover:bg-white"
          }`}
        >
          <Heart
            className="w-5 h-5"
            fill={website.isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {website.name}
          </h3>
        </div>

        {website.category && (
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full mb-3">
            {website.category}
          </span>
        )}

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {website.description || "No description provided"}
        </p>

        {/* Action Buttons */}
        <div className="flex space-x-2">
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

export default LinkCard;
