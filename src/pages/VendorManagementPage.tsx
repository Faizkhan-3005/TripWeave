import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Star, CheckCircle2, Phone, Mail, 
  Globe, Search, Filter, ShieldCheck, RefreshCw, Trash2, Edit3
} from 'lucide-react';
import { api } from '../services/api';
import { VendorModel } from '../types';
import toast from 'react-hot-toast';

export const VendorManagementPage: React.FC = () => {
  const [vendors, setVendors] = useState<VendorModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [newVendor, setNewVendor] = useState({
    name: '',
    type: 'hotel',
    email: '',
    phone: '',
    website: '',
    rating: 4.5,
    isVerified: true,
  });

  useEffect(() => {
    loadVendors();
  }, [typeFilter]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (typeFilter !== 'ALL') params.type = typeFilter;
      const res = await api.vendors.list(params);
      setVendors(res.vendors);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name) {
      toast.error('Vendor name is required');
      return;
    }

    try {
      setSubmitting(true);
      await api.vendors.create(newVendor);
      toast.success('Vendor onboarded successfully!');
      setShowAddModal(false);
      setNewVendor({
        name: '',
        type: 'hotel',
        email: '',
        phone: '',
        website: '',
        rating: 4.5,
        isVerified: true,
      });
      loadVendors();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this vendor partner?')) return;
    try {
      await api.vendors.delete(id);
      toast.success('Vendor deleted');
      loadVendors();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete vendor');
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const q = searchQuery.toLowerCase();
    return v.name.toLowerCase().includes(q) || (v.email && v.email.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-black text-white px-2.5 py-0.5 rounded-full">
            Supply Chain &amp; Contracts
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">
            Supplier &amp; Vendor Network
          </h1>
          <p className="text-xs text-gray-500">
            Partner relationships with boutique hotel chains, regional rail services, charter flight operators, and local guides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 text-xs font-bold bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Partner</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-80 bg-neutral-50 px-3.5 py-2 rounded-xl border border-gray-200/80">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search vendor name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs w-full outline-none"
          />
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {['ALL', 'hotel', 'transport', 'activity', 'mixed'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg capitalize transition-all cursor-pointer ${
                typeFilter === type ? 'bg-white text-black shadow-xs' : 'text-gray-500 hover:text-black'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading partner directory...</p>
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl bg-white">
          <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-black">No Vendors Found</p>
          <p className="text-[11px] text-gray-400">Add a new hotel, transport, or activity partner to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-black flex items-center justify-center font-bold text-base shrink-0 overflow-hidden">
                      {vendor.logo ? (
                        <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-5 h-5 text-gray-700" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-black truncate">{vendor.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">
                          {vendor.type}
                        </span>
                        {vendor.isVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded-lg text-xs font-bold shrink-0">
                    <Star className="w-3 h-3 fill-current text-amber-500" />
                    <span>{vendor.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 mt-4 border-t border-gray-100 pt-3">
                  {vendor.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                  )}
                  {vendor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                  {vendor.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <a href={vendor.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                        {vendor.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-3 text-[11px] text-gray-400">
                <span>Joined {new Date(vendor.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Deactivate Vendor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Onboard Vendor */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-black">Onboard New Supplier</h2>
            <p className="text-xs text-gray-500">Add a hospitality, transportation, or excursion partner.</p>

            <form onSubmit={handleCreateVendor} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase">Vendor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Belmond Luxury Rail"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Category</label>
                  <select
                    value={newVendor.type}
                    onChange={(e) => setNewVendor({ ...newVendor, type: e.target.value })}
                    className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
                  >
                    <option value="hotel">Hotel</option>
                    <option value="transport">Transport</option>
                    <option value="activity">Activity</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newVendor.rating}
                    onChange={(e) => setNewVendor({ ...newVendor, rating: parseFloat(e.target.value) || 4.5 })}
                    className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase">Business Email</label>
                <input
                  type="email"
                  placeholder="partnerships@company.com"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 555 0192"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 uppercase">Website URL</label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={newVendor.website}
                  onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                  className="w-full mt-1 p-2.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold bg-black text-white rounded-xl hover:bg-neutral-800 cursor-pointer shadow-xs"
                >
                  {submitting ? 'Saving...' : 'Register Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
