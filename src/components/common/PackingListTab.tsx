import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Trash2, CheckCircle2, Circle, Sparkles, 
  RefreshCw, Package, FileText, Shirt, Cpu, HeartPulse, ShoppingBag 
} from 'lucide-react';
import { PackingItemModel } from '../../types';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface PackingListTabProps {
  tripId: string;
}

const CATEGORIES = [
  { key: 'All', label: 'All Items', icon: <Package className="w-3.5 h-3.5" /> },
  { key: 'Documents', label: 'Documents', icon: <FileText className="w-3.5 h-3.5" /> },
  { key: 'Clothing', label: 'Clothing', icon: <Shirt className="w-3.5 h-3.5" /> },
  { key: 'Electronics', label: 'Electronics', icon: <Cpu className="w-3.5 h-3.5" /> },
  { key: 'Health', label: 'Health', icon: <HeartPulse className="w-3.5 h-3.5" /> },
  { key: 'Toiletries', label: 'Toiletries', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  { key: 'General', label: 'General', icon: <Package className="w-3.5 h-3.5" /> },
];

const CATEGORY_COLORS: Record<string, string> = {
  Documents: 'bg-blue-100 text-blue-700',
  Clothing: 'bg-purple-100 text-purple-700',
  Electronics: 'bg-amber-100 text-amber-700',
  Health: 'bg-rose-100 text-rose-700',
  Toiletries: 'bg-teal-100 text-teal-700',
  General: 'bg-gray-100 text-gray-600',
};

export const PackingListTab: React.FC<PackingListTabProps> = ({ tripId }) => {
  const [items, setItems] = useState<PackingItemModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [addingItem, setAddingItem] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      const res = await api.packing.list(tripId);
      setItems(res.items);
    } catch (err: any) {
      toast.error('Failed to load packing list.');
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setAddingItem(true);
    try {
      const res = await api.packing.create(tripId, { label: newLabel.trim(), category: newCategory });
      setItems((prev) => [...prev, res.item]);
      setNewLabel('');
      toast.success(`Added "${res.item.label}"!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add item.');
    } finally {
      setAddingItem(false);
    }
  };

  const handleTogglePacked = async (item: PackingItemModel) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isPacked: !i.isPacked } : i))
    );
    try {
      await api.packing.update(tripId, item.id, { isPacked: !item.isPacked });
    } catch {
      // Revert on failure
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isPacked: item.isPacked } : i))
      );
      toast.error('Failed to update item.');
    }
  };

  const handleDeleteItem = async (itemId: string, label: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    try {
      await api.packing.delete(tripId, itemId);
    } catch {
      toast.error('Failed to delete item.');
      loadItems();
    }
  };

  const handleApplyTemplate = async () => {
    setApplyingTemplate(true);
    try {
      const res = await api.packing.applyTemplate(tripId);
      setItems(res.items);
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply template.');
    } finally {
      setApplyingTemplate(false);
    }
  };

  const handleClearPacked = async () => {
    const packedItems = items.filter((i) => i.isPacked);
    if (packedItems.length === 0) return;
    setItems((prev) => prev.map((i) => ({ ...i, isPacked: false })));
    try {
      await Promise.all(packedItems.map((i) => api.packing.update(tripId, i.id, { isPacked: false })));
      toast.success(`Reset ${packedItems.length} items to unpacked.`);
    } catch {
      toast.error('Failed to reset packed items.');
      loadItems();
    }
  };

  const filteredItems = items.filter((i) => activeCategory === 'All' || i.category === activeCategory);
  const packedCount = items.filter((i) => i.isPacked).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Sort: unpacked first, packed at bottom
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.isPacked === b.isPacked) return a.label.localeCompare(b.label);
    return a.isPacked ? 1 : -1;
  });

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-black">Packing Checklist</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {totalCount === 0 
              ? 'Start adding items or load a travel template.' 
              : `${packedCount} of ${totalCount} items packed`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {packedCount > 0 && (
            <button
              onClick={handleClearPacked}
              className="text-xs font-bold text-gray-500 hover:text-black border border-gray-200 hover:border-gray-400 px-3 py-2 rounded-xl transition-colors"
            >
              Reset Packed
            </button>
          )}
          <button
            onClick={handleApplyTemplate}
            disabled={applyingTemplate}
            className="flex items-center gap-1.5 bg-black text-white hover:bg-neutral-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-60"
          >
            {applyingTemplate 
              ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              : <Sparkles className="w-3.5 h-3.5" />}
            Load Travel Template
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="bg-white border border-[#e5e5ea] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-600">Pack Progress</span>
            <span className="text-xs font-extrabold text-black">{progressPercent}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent === 100 ? 'bg-emerald-500' : 'bg-black'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            {progressPercent === 100 
              ? 'All packed! Ready to travel.' 
              : `${totalCount - packedCount} items remaining`}
          </p>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const count = cat.key === 'All' 
            ? items.length 
            : items.filter((i) => i.category === cat.key).length;
          if (cat.key !== 'All' && count === 0) return null;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat.key
                  ? 'bg-black text-white'
                  : 'bg-white border border-[#e5e5ea] text-gray-600 hover:border-gray-400'
              }`}
            >
              {cat.icon}
              {cat.label}
              {count > 0 && (
                <span className={`text-[10px] font-extrabold ${
                  activeCategory === cat.key ? 'text-gray-300' : 'text-gray-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="bg-white border border-[#e5e5ea] rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add a new item (e.g. Travel adapter)…"
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-black transition-colors"
        >
          {CATEGORIES.filter((c) => c.key !== 'All').map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={addingItem || !newLabel.trim()}
          className="flex items-center gap-1.5 bg-black text-white hover:bg-neutral-800 px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </form>

      {/* Item List */}
      {sortedItems.length === 0 ? (
        <div className="bg-white border border-[#e5e5ea] rounded-2xl p-10 text-center">
          <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-black">No items yet</p>
          <p className="text-xs text-gray-400 mt-1">Add items above or click "Load Travel Template" for a quick start.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl px-4 py-3 flex items-center gap-3 transition-all ${
                item.isPacked ? 'border-gray-100 opacity-60' : 'border-[#e5e5ea] hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => handleTogglePacked(item)}
                className={`shrink-0 transition-colors ${
                  item.isPacked ? 'text-emerald-500' : 'text-gray-300 hover:text-gray-500'
                }`}
              >
                {item.isPacked 
                  ? <CheckCircle2 className="w-5 h-5" />
                  : <Circle className="w-5 h-5" />}
              </button>

              <span className={`flex-1 text-sm font-semibold transition-all ${
                item.isPacked ? 'line-through text-gray-400' : 'text-black'
              }`}>
                {item.label}
              </span>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-600'
              }`}>
                {item.category}
              </span>

              <button
                onClick={() => handleDeleteItem(item.id, item.label)}
                className="shrink-0 text-gray-300 hover:text-red-400 transition-colors ml-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
