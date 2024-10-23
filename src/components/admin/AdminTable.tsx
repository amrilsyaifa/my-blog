"use client";

import { useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T extends { id: string }> {
  title: string;
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onReorder?: (newItems: T[]) => void;
  extraActions?: (item: T) => React.ReactNode;
}

export default function AdminTable<T extends { id: string }>({
  title,
  columns,
  data,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  extraActions,
}: AdminTableProps<T>) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    e.dataTransfer.effectAllowed = "move";
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overIdx !== idx) setOverIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) return;
    const reordered = [...data];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    onReorder?.(reordered);
    setDragIdx(null);
    setOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-100">{title}</h1>
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#2d3748] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#13151f] border-b border-[#2d3748]">
              {onReorder && <th className="w-8 px-3 py-3" />}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + 1 + (onReorder ? 1 : 0)}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1 + (onReorder ? 1 : 0)}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No data yet. Click + Add to create one.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.id}
                  draggable={!!onReorder}
                  onDragStart={onReorder ? (e) => handleDragStart(e, idx) : undefined}
                  onDragOver={onReorder ? (e) => handleDragOver(e, idx) : undefined}
                  onDrop={onReorder ? () => handleDrop(idx) : undefined}
                  onDragEnd={onReorder ? handleDragEnd : undefined}
                  className={[
                    "border-b border-[#2d3748] last:border-0 transition-all duration-150",
                    idx % 2 === 0 ? "bg-[#1a1d27]" : "bg-[#1e2130]",
                    dragIdx === idx ? "opacity-40" : "",
                    overIdx === idx && dragIdx !== idx ? "border-t-2 border-t-indigo-500" : "",
                  ].join(" ")}
                >
                  {onReorder && (
                    <td className="px-3 py-3 cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors select-none">
                      <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
                        <circle cx="3" cy="3" r="1.5" />
                        <circle cx="9" cy="3" r="1.5" />
                        <circle cx="3" cy="8" r="1.5" />
                        <circle cx="9" cy="8" r="1.5" />
                        <circle cx="3" cy="13" r="1.5" />
                        <circle cx="9" cy="13" r="1.5" />
                      </svg>
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-slate-300 max-w-[240px] truncate"
                    >
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {extraActions?.(item)}
                      <button
                        onClick={() => onEdit(item)}
                        className="px-3 py-1.5 rounded-lg bg-[#2d3748] hover:bg-[#384561] text-slate-200 text-xs transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-300 text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
