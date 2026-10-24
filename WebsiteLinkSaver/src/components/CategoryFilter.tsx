import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}

const CategoryFilter = ({ categories, value, onChange }: CategoryFilterProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const sorted = [...categories].sort((a, b) => a.localeCompare(b));
  const label = value || "All categories";

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative w-full min-w-0 lg:w-80 lg:shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-4 py-2 text-left text-gray-900 transition-colors hover:bg-gray-50 ${
          value ? "border-primary-600" : "border-gray-300"
        }`}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Categories"
          className="absolute left-0 z-30 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg sm:w-max sm:min-w-full sm:max-w-sm"
        >
          <FilterOption
            label="All categories"
            selected={!value}
            onClick={() => choose("")}
          />
          {sorted.map((category) => (
            <FilterOption
              key={category}
              label={category}
              selected={category === value}
              onClick={() => choose(category)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

interface FilterOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const FilterOption = ({ label, selected, onClick }: FilterOptionProps) => {
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        onClick={onClick}
        className={`flex w-full items-start gap-3 px-4 py-2 text-left text-sm ${
          selected
            ? "bg-primary-50 font-medium text-primary-700"
            : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        <span className="min-w-0 flex-1 whitespace-normal">{label}</span>
        {selected && <Check className="mt-0.5 h-4 w-4 shrink-0" />}
      </button>
    </li>
  );
};

export default CategoryFilter;
