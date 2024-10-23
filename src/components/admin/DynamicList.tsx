"use client";

interface DynamicListProps {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}

export default function DynamicList({
  label,
  value,
  onChange,
  placeholder = "Add item…",
}: DynamicListProps) {
  const update = (i: number, v: string) => {
    const next = [...value];
    next[i] = v;
    onChange(next);
  };

  const add = () => onChange([...value, ""]);

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </label>

      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-[#0f1117] border border-[#2d3748] text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="px-2 py-1 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-400 text-sm transition-colors"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        + Add item
      </button>
    </div>
  );
}
