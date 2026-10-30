"use client";

type CategoryChipsProps = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex gap-space-8 overflow-x-auto px-space-4">
      {categories.map((category) => {
        const isSelected = category === selected;
        return (
          <button
            key={category}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(category)}
            className={`flex h-[36px] shrink-0 items-center rounded-full px-space-16 text-label-md ${
              isSelected
                ? "bg-primary text-text-on-primary"
                : "bg-surface-card text-text-secondary"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
