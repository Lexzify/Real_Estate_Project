import { formatLabel } from "../constants/filterOptions";

function AmenitySelector({ title, options, selected = [], onChange }) {
  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
      return;
    }
    onChange([...selected, value]);
  };

  return (
    <div className="space-y-2">
      {title && (
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b837d]">{title}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`pill ${
                active
                  ? "pill-active border-rose-300 bg-gradient-to-r from-rose-50 to-pink-50"
                  : ""
              }`}
            >
              {formatLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AmenitySelector;
