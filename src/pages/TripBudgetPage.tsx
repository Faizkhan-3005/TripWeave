import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  DollarSign, Plus, Trash2, Calendar, TrendingUp, AlertTriangle, 
  Download, ArrowLeft, CheckCircle2, PieChart as PieIcon, BarChart as BarIcon, 
  Tag, Clock, ArrowRight, Paperclip, FileText, Image as ImageIcon, ExternalLink, X
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { BudgetStats, TripModel } from '../types';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORY_COLORS: Record<string, string> = {
  Transport: '#3b82f6',
  Accommodation: '#8b5cf6',
  Activities: '#10b981',
  Meals: '#f59e0b',
  Other: '#64748b',
};

export const TripBudgetPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();

  const [trip, setTrip] = useState<TripModel | null>(null);
  const [stats, setStats] = useState<BudgetStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Expense Form State
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number>(100);
  const [expenseCategory, setExpenseCategory] = useState('Accommodation');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseNotes, setExpenseNotes] = useState('');
  const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);
  const [attachmentFileName, setAttachmentFileName] = useState<string | null>(null);
  const [submittingExpense, setSubmittingExpense] = useState(false);

  // Attachment Preview Modal
  const [previewAttachment, setPreviewAttachment] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    if (tripId) {
      loadBudgetData(tripId);
    }
  }, [tripId]);

  const loadBudgetData = async (id: string) => {
    try {
      setLoading(true);
      const [tripRes, statsRes] = await Promise.all([
        api.trips.get(id),
        api.budget.getStats(id),
      ]);
      setTrip(tripRes.trip);
      setStats(statsRes);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load budget analytics.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5MB)');
      return;
    }

    setAttachmentFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachmentBase64(reader.result as string);
      toast.success(`Attached ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId || !expenseTitle || !expenseAmount) return;

    setSubmittingExpense(true);
    try {
      await api.budget.addExpense(tripId, {
        title: expenseTitle,
        amount: Number(expenseAmount),
        category: expenseCategory,
        date: expenseDate,
        notes: expenseNotes,
        attachmentUrl: attachmentBase64,
        attachmentName: attachmentFileName,
      });
      toast.success('Expense recorded with receipt! 💵');
      setExpenseTitle('');
      setExpenseNotes('');
      setAttachmentBase64(null);
      setAttachmentFileName(null);
      loadBudgetData(tripId);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add expense.');
    } finally {
      setSubmittingExpense(false);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!tripId) return;
    try {
      await api.budget.deleteExpense(tripId, expenseId);
      toast.success('Expense removed.');
      loadBudgetData(tripId);
    } catch (err: any) {
      toast.error('Failed to remove expense.');
    }
  };

  if (loading || !trip || !stats) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to={`/app/trips/${trip.id}/builder`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Itinerary Builder
          </Link>
          <h1 className="text-3xl font-black text-black tracking-tight font-sans">
            Budget &amp; Spending Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5d6e] mt-0.5">
            {trip.title} &bull; {trip.durationDays} Days &bull; Budget limit: ${trip.budget.toLocaleString()}
          </p>
        </div>

        <button
          onClick={async () => {
            if (!trip) return;
            try {
              await api.trips.downloadTripCsv(trip.id, trip.title);
              toast.success('Budget & Itinerary CSV downloaded! 📊');
            } catch (err: any) {
              toast.error(err.message || 'Failed to download CSV.');
            }
          }}
          className="bg-black text-white hover:bg-neutral-800 active:scale-95 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm w-fit cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Excel CSV</span>
        </button>
      </div>

      {/* Over-Budget Alert Banner */}
      {stats.isOverBudget && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-900 animate-in slide-in-from-top-2">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Over Budget Alert:</span> Your total expenses (${stats.totalSpent.toLocaleString()}) exceed your planned budget of ${stats.totalBudget.toLocaleString()} by ${(stats.totalSpent - stats.totalBudget).toLocaleString()}.
          </div>
        </div>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-[#e5e5ea] shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 block mb-1">Total Budget</span>
          <span className="text-2xl font-black text-black">${stats.totalBudget.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 block mt-1">Planned allocation</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e5e5ea] shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 block mb-1">Total Spent</span>
          <span className="text-2xl font-black text-black">${stats.totalSpent.toLocaleString()}</span>
          <span className={`text-[10px] font-bold block mt-1 ${stats.isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
            {stats.percentUsed}% of budget used
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e5e5ea] shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 block mb-1">Remaining Budget</span>
          <span className={`text-2xl font-black ${stats.remainingBudget < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            ${stats.remainingBudget.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-400 block mt-1">
            ${stats.remainingDailyAllowance}/day remaining
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#e5e5ea] shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 block mb-1">Daily Average</span>
          <span className="text-2xl font-black text-black">${stats.dailyAverageSpent}</span>
          <span className="text-[10px] text-gray-400 block mt-1">
            Across {stats.durationDays} travel days
          </span>
        </div>
      </div>

      {/* 3. Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Breakdown (Donut Chart) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-black tracking-tight flex items-center gap-2">
              <PieIcon className="w-4 h-4" /> Category Spending Breakdown
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryBreakdown.filter(c => c.amount > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="amount"
                  nameKey="category"
                >
                  {stats.categoryBreakdown.map((entry) => (
                    <Cell 
                      key={entry.category} 
                      fill={CATEGORY_COLORS[entry.category] || '#000'} 
                    />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-100">
            {stats.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="flex items-center gap-2 text-xs">
                <span 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: CATEGORY_COLORS[cat.category] || '#000' }} 
                />
                <div className="min-w-0">
                  <span className="font-bold text-black truncate block">{cat.category}</span>
                  <span className="text-[10px] text-gray-500">${cat.amount.toLocaleString()} ({cat.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Spending Trend (Bar Chart) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-black tracking-tight flex items-center gap-2">
              <BarIcon className="w-4 h-4" /> Daily Spending Timeline
            </h3>
            {stats.highestSpendingDay && (
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md">
                Peak: ${stats.highestSpendingDay.amount} on {stats.highestSpendingDay.date}
              </span>
            )}
          </div>

          <div className="h-64 w-full">
            {stats.spendingTrend.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Log your first expense below to view daily spending trends.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.spendingTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f2" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Spent']} />
                  <Bar dataKey="amount" fill="#18181b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* 4. Log Expense Form & Expenses Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Log Expense Form Card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs space-y-4">
          <h3 className="text-base font-black text-black tracking-tight">
            Log New Expense
          </h3>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-black mb-1">Expense Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Flight to Rome / Dinner at Bistro"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-black mb-1">Amount ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full bg-[#f9f9fb] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">Category</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full bg-[#f9f9fb] border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-black font-semibold focus:outline-none"
                >
                  <option value="Accommodation">Accommodation</option>
                  <option value="Transport">Transport</option>
                  <option value="Activities">Activities</option>
                  <option value="Meals">Meals &amp; Dining</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Date</label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1">Notes (Optional)</label>
              <input
                type="text"
                placeholder="Receipt #, notes..."
                value={expenseNotes}
                onChange={(e) => setExpenseNotes(e.target.value)}
                className="w-full bg-[#f9f9fb] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none"
              />
            </div>

            {/* Receipt & Ticket Attachment Upload */}
            <div>
              <label className="block text-xs font-bold text-black mb-1 flex items-center justify-between">
                <span>Attach Receipt / Ticket (Optional)</span>
                {attachmentFileName && (
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentBase64(null);
                      setAttachmentFileName(null);
                    }}
                    className="text-[10px] font-bold text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </label>

              <label className="border border-dashed border-gray-300 hover:border-black rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 hover:text-black cursor-pointer bg-[#f9f9fb] transition-all">
                <Paperclip className="w-4 h-4 text-gray-500" />
                <span className="truncate max-w-[200px]">
                  {attachmentFileName || 'Upload Photo / PDF Receipt'}
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={submittingExpense}
              className="w-full bg-black text-white hover:bg-neutral-800 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submittingExpense ? 'Recording...' : '+ Record Expense'}
            </button>
          </form>
        </div>

        {/* Expenses List Card */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[32px] border border-[#e5e5ea] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-black tracking-tight">
              Logged Expenses ({stats.expenses.length})
            </h3>
          </div>

          {stats.expenses.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400">
              No expenses recorded yet for this trip.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {stats.expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-[#f9f9fb] p-3.5 rounded-2xl border border-gray-200 flex items-center justify-between gap-3 hover:bg-white transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span 
                        className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: CATEGORY_COLORS[exp.category] || '#000' }}
                      >
                        {exp.category}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(exp.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h5 className="font-extrabold text-xs text-black truncate">{exp.title}</h5>
                    {exp.notes && <p className="text-[10px] text-gray-500 mt-0.5">{exp.notes}</p>}

                    {/* Receipt / Ticket Attachment Pill */}
                    {exp.attachmentUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewAttachment({
                            url: exp.attachmentUrl!,
                            name: exp.attachmentName || exp.title,
                          })
                        }
                        className="mt-2 inline-flex items-center gap-1 bg-white hover:bg-gray-100 text-black border border-gray-200 px-2 py-1 rounded-lg text-[10px] font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-3 h-3 text-blue-600" />
                        <span className="truncate max-w-[140px]">
                          {exp.attachmentName || 'View Receipt / Ticket'}
                        </span>
                        <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-black text-black">${exp.amount.toLocaleString()}</span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      title="Delete expense"
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setPreviewAttachment(null)}
        >
          <div 
            className="bg-white max-w-2xl w-full max-h-[85vh] rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-black text-black truncate max-w-md">
                  {previewAttachment.name}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewAttachment.url}
                  download={previewAttachment.name || 'receipt'}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button
                  onClick={() => setPreviewAttachment(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-black flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
              {previewAttachment.url.startsWith('data:image/') ? (
                <img
                  src={previewAttachment.url}
                  alt={previewAttachment.name}
                  className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-sm"
                />
              ) : (
                <iframe
                  src={previewAttachment.url}
                  title="Document Preview"
                  className="w-full h-[60vh] rounded-xl border border-gray-200"
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
