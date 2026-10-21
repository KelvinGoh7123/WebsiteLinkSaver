import { useState, useEffect } from "react";
import { WebsiteLink, WebsiteLinkInput } from "../types";
import LinkCard from "../components/LinkCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import EditModal from "../components/EditModal";
import Notification from "../components/Notification";
import { useWebsites } from "../context/WebsiteContext";
import { Link } from "react-router-dom";
import { Plus, FolderOpen } from "lucide-react";

const Home = () => {
  const { websites, loading, syncing, deleteWebsite, updateWebsite, toggleFavorite } =
    useWebsites();
  const [filteredWebsites, setFilteredWebsites] = useState<WebsiteLink[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingWebsite, setEditingWebsite] = useState<WebsiteLink | null>(
    null
  );
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
      //console.log("Updating website with data:", data);
      await updateWebsite(id, data);
    } catch (error) {
      console.error("Error updating website:", error);
      alert(
        `Failed to update website: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleEditSuccess = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await toggleFavorite(id, isFavorite);
    } catch (error) {
      //console.error("Error toggling favorite:", error);
      alert("Failed to update favorite status");
    }
  };

  // Get unique categories
  const categories = Array.from(
    new Set(websites.map((w) => w.category).filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Saved Websites
          </h1>
          <p className="text-gray-600">
            Manage and organize your favorite website links
          </p>
          {syncing && websites.length > 0 && (
            <p className="mt-2 text-sm text-primary-600">Updating…</p>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search by name, category, or URL..."
          />
          <Link to="/add" className="btn-primary whitespace-nowrap">
            <Plus className="w-5 h-5 inline mr-2" />
            Add New Link
          </Link>
        </div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSearchTerm("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !searchTerm
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  searchTerm === category
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Empty State */}
        {!loading && websites.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No websites saved yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start building your collection by adding your first link
            </p>
            <Link to="/add" className="btn-primary inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Link
            </Link>
          </div>
        )}

        {/* No Results State */}
        {!loading && websites.length > 0 && filteredWebsites.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              No websites found for "{searchTerm}"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            onSuccess={handleEditSuccess}
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

export default Home;
