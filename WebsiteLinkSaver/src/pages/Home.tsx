import { useState, useEffect } from "react";
import { WebsiteLink, WebsiteLinkInput } from "../types";
import LinkCard from "../components/LinkCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import EditModal from "../components/EditModal";
import Notification from "../components/Notification";
import { useWebsites } from "../context/WebsiteContext";
import QuickAdd from "../components/QuickAdd";
import GridColumnsControl, { useGridColumns } from "../components/GridColumns";
import CategoryFilter from "../components/CategoryFilter";
import { Link } from "react-router-dom";
import { Plus, FolderOpen } from "lucide-react";

const Home = () => {
  const {
    websites,
    loading,
    syncing,
    deleteWebsite,
    updateWebsite,
    toggleFavorite,
    renameCategory,
  } = useWebsites();
  const [filteredWebsites, setFilteredWebsites] = useState<WebsiteLink[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingWebsite, setEditingWebsite] = useState<WebsiteLink | null>(
    null
  );
  const { columns, updateColumns, gridClassName } = useGridColumns();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = websites.filter((website) => {
      const matchesCategory =
        !selectedCategory || website.category === selectedCategory;
      const matchesSearch =
        !term ||
        website.name.toLowerCase().includes(term) ||
        website.description.toLowerCase().includes(term) ||
        website.category.toLowerCase().includes(term) ||
        website.url.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
    setFilteredWebsites(filtered);
  }, [searchTerm, selectedCategory, websites]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-bold text-gray-900">My Saved Websites</h1>
          {!loading && (
            <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
              {websites.length} saved
            </span>
          )}
          {syncing && websites.length > 0 && (
            <span className="text-xs text-gray-400">Updating…</span>
          )}
        </div>

        <QuickAdd
          websites={websites}
          onSaved={(name) => {
            setNotificationMessage(`${name} saved`);
            setShowNotification(true);
          }}
          onShowExisting={(website) => {
            setSelectedCategory("");
            setSearchTerm(website.name);
          }}
        />

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="w-full lg:max-w-sm lg:shrink-0">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search by name, category, or URL..."
            />
          </div>
          {categories.length > 0 && (
            <CategoryFilter
              categories={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              onRename={renameCategory}
            />
          )}
          <div className="lg:ml-auto">
            <GridColumnsControl columns={columns} onChange={updateColumns} />
          </div>
        </div>

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
              No websites found
              {(selectedCategory || searchTerm) &&
                ` for "${[selectedCategory, searchTerm]
                  .filter(Boolean)
                  .join(" · ")}"`}
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
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
