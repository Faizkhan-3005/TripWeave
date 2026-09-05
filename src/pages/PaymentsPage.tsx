import React, { useState, useEffect } from 'react';
import { 
  CreditCard, DollarSign, CheckCircle2, Clock, XCircle, 
  RotateCcw, Search, Filter, RefreshCw, ArrowDownRight, ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import { PaymentModel } from '../types';
import toast from 'react-hot-toast';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refundingId, setRefundingId] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, [statusFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await api.payments.list(params);
      setPayments(res.payments);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load payments ledger');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (id: string) => {
    if (!confirm('Are you sure you want to refund this payment transaction?')) return;
    try {
      setRefundingId(id);
      await api.payments.refund(id);
      toast.success('Payment refunded successfully');
      loadPayments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to refund payment');
    } finally {
      setRefundingId(null);
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
            Financial Clearing
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">
            Payments &amp; Revenue Ledger
          </h1>
          <p className="text-xs text-gray-500">
            Real-time Stripe gateway transactions, traveler invoices, card checkouts, and refund dispatches.
          </p>
        </div>

        <button
          onClick={loadPayments}
          className="flex items-center gap-2 text-xs font-bold bg-[#f3f3f6] hover:bg-gray-200 text-black px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Settled Revenue</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">${totalPaid.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 mt-1">Verified via Stripe gateway</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Pending Invoices</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">${totalPending.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 mt-1">Awaiting bank settlement</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Total Transactions</span>
          <p className="text-2xl sm:text-3xl font-black text-black mt-1">{payments.length}</p>
          <p className="text-[10px] text-gray-400 mt-1">Captured ledger entries</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs flex items-center gap-1 overflow-x-auto">
        {['ALL', 'PAID', 'PENDING', 'REFUNDED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              statusFilter === st ? 'bg-black text-white shadow-xs' : 'text-gray-500 hover:text-black hover:bg-gray-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-500">Loading payment ledger...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl">
            <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-black">No Transactions Found</p>
            <p className="text-[11px] text-gray-400">Payment records will generate when travelers book itinerary items.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 text-gray-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="pb-3 px-3">Transaction / ID</th>
                  <th className="pb-3 px-3">Method</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-black text-xs">
                        {p.transactionId || `PAY-${p.id.slice(0, 8).toUpperCase()}`}
                      </p>
                      <p className="text-[10px] text-gray-400">Booking Ref #{p.bookingId.slice(0, 8)}</p>
                    </td>

                    <td className="py-3.5 px-3 uppercase text-[11px] font-bold text-gray-600">
                      {p.method}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-black text-black text-sm">${p.amount.toLocaleString()}</p>
                    </td>

                    <td className="py-3.5 px-3 text-gray-500">
                      {p.paidAt ? new Date(p.paidAt).toLocaleString() : new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      {p.status === 'PAID' && (
                        <button
                          onClick={() => handleRefund(p.id)}
                          disabled={refundingId === p.id}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          {refundingId === p.id ? 'Processing...' : 'Refund'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
