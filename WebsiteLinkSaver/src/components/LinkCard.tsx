import { ExternalLink, Trash2, Edit, Heart } from "lucide-react";
import { WebsiteLink } from "../types";
import { isIconImage, shortSiteName } from "../utils/links";
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
  const name = shortSiteName(website.name);
  const metaTitle = [website.name, website.category.trim(), domain]
    .filter(Boolean)
    .join(" · ");
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
      <div className="relative aspect-[16/10] overflow-hidden bg-[#ebe6de]">
        <button
          type="button"
          onClick={handleVisit}
          aria-label={`Open ${website.name}`}
          className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neutral-950"
        >
          {showIcon && (
            <span className="flex h-full items-center justify-center">
              <img
                src={website.imageUrl}
                alt=""
                className="h-16 w-16 rounded-2xl bg-white object-contain p-2 shadow-sm"
                onError={() => setImageError(true)}
              />
            </span>
          )}
          {showImage && !showIcon && (
            <img
              src={website.imageUrl}
              alt=""
              className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)}
            />
          )}
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(website.id, !website.isFavorite)}
          className={`absolute top-3 right-3 z-10 rounded-full p-2 shadow-sm ring-2 ring-white transition-colors duration-200 ${
            website.isFavorite
              ? "bg-red-500 text-white"
              : "bg-white text-neutral-700 hover:text-red-500"
          }`}
          title={website.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className="h-4 w-4"
            fill={website.isFavorite ? "currentColor" : "none"}
          />
        </button>
        <div className="absolute inset-x-3 bottom-3 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleVisit}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-neutral-950 shadow-sm transition-opacity max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Visit
          </button>
          <button
            type="button"
            onClick={() => onEdit(website)}
            className="ml-auto rounded-full bg-white p-2 text-neutral-800 shadow-sm transition-opacity max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="rounded-full bg-white p-2 text-neutral-800 shadow-sm transition-opacity hover:text-red-600 max-sm:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-3 py-3">
        <p className="truncate text-sm text-neutral-500" title={metaTitle}>
          <button
            type="button"
            onClick={handleVisit}
            className="font-medium text-neutral-950"
          >
            {name}
          </button>
          {website.category.trim() && (
            <span>{` · ${website.category}`}</span>
          )}
          <span>{` · ${domain}`}</span>
        </p>
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
