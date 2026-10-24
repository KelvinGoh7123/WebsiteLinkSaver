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
    syncing,
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center">
              <Heart className="mr-3 h-10 w-10 fill-current text-red-500" />
              <h1 className="text-4xl font-bold text-gray-900">
                Favorite Websites
              </h1>
            </div>
            <p className="text-gray-600">
              Quick access to your most important links
            </p>
          </div>
          {!loading && (
            <div className="shrink-0 text-right">
              <p className="text-sm font-medium text-gray-500">
                {websites.length} favorite{websites.length === 1 ? "" : "s"}
              </p>
              {syncing && <p className="text-xs text-gray-400">Updating…</p>}
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
          <GridColumnsControl columns={columns} onChange={updateColumns} />
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
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
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
