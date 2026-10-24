import { useState } from "react";

const GRID_COLUMNS_KEY = "link-saver-grid-columns";

export type GridColumns = 2 | 3 | 4;

const columnClasses: Record<GridColumns, string> = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

export function getGridColumns(): GridColumns {
  try {
    const value = Number(localStorage.getItem(GRID_COLUMNS_KEY));
    if (value === 2 || value === 3 || value === 4) return value;
  } catch {
    // Ignore storage failures in private browsing.
  }
  return 3;
}

export function rememberGridColumns(columns: GridColumns) {
  try {
    localStorage.setItem(GRID_COLUMNS_KEY, String(columns));
  } catch {
    // Ignore storage failures in private browsing.
  }
}

export function useGridColumns() {
  const [columns, setColumns] = useState<GridColumns>(getGridColumns);

  const updateColumns = (next: GridColumns) => {
    setColumns(next);
    rememberGridColumns(next);
  };

  return { columns, updateColumns, gridClassName: columnClasses[columns] };
}

interface GridColumnsControlProps {
  columns: GridColumns;
  onChange: (columns: GridColumns) => void;
}

const choices: GridColumns[] = [2, 3, 4];

const GridColumnsControl = ({ columns, onChange }: GridColumnsControlProps) => {
  return (
    <div
      className="flex shrink-0 rounded-lg border border-gray-200 bg-white p-1"
      role="group"
      aria-label="Cards per row"
    >
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          aria-pressed={columns === choice}
          onClick={() => onChange(choice)}
          className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${
            columns === choice
              ? "bg-primary-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default GridColumnsControl;
