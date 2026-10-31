import { useState, useEffect, useMemo } from "react";
import { WebsiteLink, WebsiteLinkInput } from "../types";
import LinkCard from "../components/LinkCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import EditModal from "../components/EditModal";
import Notification from "../components/Notification";
import { useWebsites } from "../context/WebsiteContext";
import GridColumnsControl, { useGridColumns } from "../components/GridColumns";
import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";

const Favorites = () => {
  const {
    websites: allWebsites,
    loading,
    deleteWebsite,
    updateWebsite,
    toggleFavorite,
  } = useWebsites();
  const websites = useMemo(
    () => allWebsites.filter((website) => website.isFavorite),
    [allWebsites]
  );
  const [filteredWebsites, setFilteredWebsites] = useState<WebsiteLink[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingWebsite, setEditingWebsite] = useState<WebsiteLink | null>(
    null
  );
  const { columns, updateColumns, gridClassName } = useGridColumns();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    filterWebsites();
  }, [searchTerm, websites]);

  const filterWebsites = () => {
    if (!searchTerm.trim()) {
      setFilteredWebsites(websites);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = websites.filter(
      (website) =>
        website.name.toLowerCase().includes(term) ||
        website.description.toLowerCase().includes(term) ||
        website.category.toLowerCase().includes(term) ||
        website.url.toLowerCase().includes(term)
    );
    setFilteredWebsites(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWebsite(id);

      // Show success notification
      setNotificationMessage("Website deleted successfully!");
      setShowNotification(true);
    } catch (error) {
      console.error("Error deleting website:", error);
      alert("Failed to delete website");
    }
  };

  const handleEdit = (website: WebsiteLink) => {
    setEditingWebsite(website);
  };

  const handleSaveEdit = async (
    id: string,
    data: Partial<WebsiteLinkInput>
  ) => {
    try {
      await updateWebsite(id, data);
    } catch (error) {
      console.error("Error updating website:", error);
      alert("Failed to update website");
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await toggleFavorite(id, isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorite status");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1eb]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl tracking-tight text-neutral-950">
              Favorites
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Quick access to your most important links
            </p>
          </div>
          {!loading && (
            <div className="shrink-0 text-right">
              <p className="text-sm font-medium text-neutral-500">
                {websites.length} favorite{websites.length === 1 ? "" : "s"}
              </p>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search favorites..."
            />
          </div>
          <div className="hidden shrink-0 md:block">
            <GridColumnsControl columns={columns} onChange={updateColumns} />
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Empty State */}
        {!loading && websites.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500 mb-6">
              Mark websites as favorites by clicking the heart icon
            </p>
            <Link to="/" className="btn-primary inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Browse All Websites
            </Link>
          </div>
        )}

        {/* No Results State */}
        {!loading && websites.length > 0 && filteredWebsites.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              No favorites found for "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 font-medium text-neutral-950 underline-offset-4 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Website Grid */}
        {!loading && filteredWebsites.length > 0 && (
          <div className={`grid gap-6 ${gridClassName}`}>
            {filteredWebsites.map((website) => (
              <LinkCard
                key={website.id}
                website={website}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingWebsite && (
          <EditModal
            website={editingWebsite}
            isOpen={!!editingWebsite}
            onClose={() => setEditingWebsite(null)}
            onSave={handleSaveEdit}
          />
        )}

        {/* Success Notification */}
        <Notification
          message={notificationMessage}
          type="success"
          isVisible={showNotification}
          onClose={() => setShowNotification(false)}
        />
      </div>
    </div>
  );
};

export default Favorites;
