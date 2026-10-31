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

const Home = () => {
  const {
    websites,
    loading,
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
  const [adding, setAdding] = useState(false);

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
    <div className="min-h-screen bg-[#f4f1eb]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6 py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl tracking-tight text-neutral-950">
              Library
            </h1>
            {!loading && (
              <p className="mt-2 text-sm text-neutral-500">{websites.length} saved</p>
            )}
          </div>
          {!loading && websites.length > 0 && (
            <button
              type="button"
              onClick={() => setAdding((open) => !open)}
              className="mb-1 rounded-full border border-neutral-950 px-4 py-1.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
            >
              {adding ? "Close" : "Add"}
            </button>
          )}
        </div>

        {(adding || (!loading && websites.length === 0)) && (
          <QuickAdd
            websites={websites}
            onSaved={(name) => {
              setNotificationMessage(`${name} saved`);
              setShowNotification(true);
              setAdding(false);
            }}
            onShowExisting={(website) => {
              setSelectedCategory("");
              setSearchTerm(website.name);
              setAdding(false);
            }}
          />
        )}

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
          <div className="hidden md:block lg:ml-auto">
            <GridColumnsControl columns={columns} onChange={updateColumns} />
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

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
              className="mt-4 font-medium text-neutral-950 underline-offset-4 hover:underline"
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
