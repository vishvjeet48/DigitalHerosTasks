import { STATUS_OPTIONS } from '../../types/lead';

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  const filterItems = [{ id: '', label: 'All' }, ...STATUS_OPTIONS.map((s) => ({ id: s, label: s }))];

  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/80 p-1 shadow-2xs">
      {filterItems.map((item) => {
        const isActive = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all select-none ${
              isActive
                ? 'bg-white text-primary-700 shadow-xs ring-1 ring-gray-950/5 font-bold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

