import { useMemo } from "react";
import { useWebsites } from "../context/WebsiteContext";
import { resolveCategory } from "../utils/links";

const SUGGESTED_CATEGORIES = [
  "Design",
  "Tools",
  "Learning",
  "Inspiration",
  "Reading",
  "Video",
  "Code",
  "Animation",
  "Reference",
  "Articles",
  "News",
  "Productivity",
  "Research",
  "Writing",
];

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
  const savedNames = new Set(categories.map((category) => category.toLowerCase()));
  const suggestions = SUGGESTED_CATEGORIES.filter(
    (category) => !savedNames.has(category.toLowerCase())
  );

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
      {categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              selected={category.toLowerCase() === selected}
              onClick={() => onChange(category)}
            />
          ))}
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-xs text-gray-500">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                selected={category.toLowerCase() === selected}
                quiet
                onClick={() => onChange(category)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface CategoryChipProps {
  label: string;
  selected: boolean;
  quiet?: boolean;
  onClick: () => void;
}

const CategoryChip = ({ label, selected, quiet, onClick }: CategoryChipProps) => {
  const idle = quiet
    ? "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
    : "border border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200";

  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
        selected ? "border border-primary-600 bg-primary-600 text-white" : idle
      }`}
    >
      {label}
    </button>
  );
};

export default CategoryField;
