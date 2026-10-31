import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Pencil } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
  onRename: (from: string, to: string) => Promise<string>;
}

const CategoryFilter = ({
  categories,
  value,
  onChange,
  onRename,
}: CategoryFilterProps) => {
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [renameError, setRenameError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const sorted = [...categories].sort((a, b) => a.localeCompare(b));
  const label = value || "All categories";

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setRenaming(null);
        setRenameError("");
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (renaming) {
        setRenaming(null);
        setRenameError("");
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, renaming]);

  const choose = (next: string) => {
    onChange(next);
    setRenaming(null);
    setOpen(false);
  };

  const startRename = (category: string) => {
    setRenaming(category);
    setDraft(category);
    setRenameError("");
  };

  const saveRename = async (event: FormEvent) => {
    event.preventDefault();
    if (!renaming || saving) return;
    const next = draft.trim();
    if (!next) {
      setRenameError("Enter a name.");
      return;
    }

    try {
      setSaving(true);
      setRenameError("");
      const saved = await onRename(renaming, next);
      if (value === renaming && saved && saved !== renaming) onChange(saved);
      setRenaming(null);
    } catch (error) {
      console.error("Error renaming category:", error);
      setRenameError("Could not rename that category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={rootRef} className="relative w-full min-w-0 lg:w-80 lg:shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() =>
          setOpen((current) => {
            if (current) {
              setRenaming(null);
              setRenameError("");
            }
            return !current;
          })
        }
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-4 py-2 text-left text-gray-900 transition-colors hover:bg-gray-50 ${
          value ? "border-neutral-950" : "border-neutral-300"
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
          {renaming && (
            <li className="border-b border-gray-100 px-3 py-2">
              <form onSubmit={saveRename}>
                <p className="text-xs text-gray-500">
                  Rename “{renaming}” for every link
                </p>
                <input
                  type="text"
                  value={draft}
                  autoFocus
                  onChange={(event) => setDraft(event.target.value)}
                  className="input-field mt-2 px-3 py-1.5 text-sm"
                  aria-label={`New name for ${renaming}`}
                />
                {renameError && (
                  <p className="mt-1 text-xs text-red-600">{renameError}</p>
                )}
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="text-sm font-medium text-neutral-950 hover:text-neutral-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRenaming(null);
                      setRenameError("");
                    }}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </li>
          )}
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
              onRename={() => startRename(category)}
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
  onRename?: () => void;
}

const FilterOption = ({ label, selected, onClick, onRename }: FilterOptionProps) => {
  return (
    <li className={selected ? "bg-neutral-100" : "hover:bg-neutral-50"}>
      <div className="flex items-start">
        <button
          type="button"
          role="option"
          aria-selected={selected}
          onClick={onClick}
          className={`flex min-w-0 flex-1 items-start gap-3 px-4 py-2 text-left text-sm ${
            selected ? "font-medium text-neutral-950" : "text-neutral-800"
          }`}
        >
          <span className="min-w-0 flex-1 whitespace-normal">{label}</span>
          {selected && <Check className="mt-0.5 h-4 w-4 shrink-0" />}
        </button>
        {onRename && (
          <button
            type="button"
            onClick={onRename}
            aria-label={`Rename ${label}`}
            title="Rename"
            className="mr-2 mt-1.5 rounded p-1 text-gray-400 hover:bg-white hover:text-gray-700"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </li>
  );
};

export default CategoryFilter;
