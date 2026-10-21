import { useMemo } from "react";
import { useWebsites } from "../context/WebsiteContext";
import { resolveCategory } from "../utils/links";

interface CategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function useSavedCategories(): string[] {
  const { websites } = useWebsites();
  return useMemo(
    () =>
      Array.from(
        new Set(websites.map((website) => website.category.trim()).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    [websites]
  );
}

const CategoryField = ({ value, onChange }: CategoryFieldProps) => {
  const categories = useSavedCategories();
  const selected = value.trim().toLowerCase();

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Category
      </label>
      <input
        type="text"
        className="input-field"
        placeholder="Choose a category or type a new one"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => onChange(resolveCategory(value, categories))}
      />
      {categories.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = category.toLowerCase() === selected;
            return (
              <button
                key={category}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onChange(category)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mt-1 text-sm text-gray-500">
          Type a category. It will show up here next time.
        </p>
      )}
    </div>
  );
};

export default CategoryField;
