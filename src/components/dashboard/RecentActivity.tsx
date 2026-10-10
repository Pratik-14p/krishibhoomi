import React, { useState, useMemo, useEffect } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, PackageOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { soilAnalysisService } from '../../services/soilAnalysisService';
import { FarmActivity } from '../../types';

export const RecentActivity: React.FC = () => {
  const { user } = useAuth();
  const farmArea = user?.farmArea ?? 0;
  const locationLabel = user?.location ? user.location.split(',')[0].trim() : 'Active Holding';

  // Build field options for task assignment
  const fieldOptions = useMemo(() => {
    const crop = user?.preferredCrop?.split('&')[0]?.trim();
    const actualFarmLabel = [user?.location, crop].filter(Boolean).join(' · ');
    return [actualFarmLabel || 'General farm task'];
  }, [user?.location, user?.preferredCrop]);

  // Initial activities: load user-scoped or empty
  const initialActivities: FarmActivity[] = useMemo(() => {
    try {
      const key = user?.id ? `krishibhoomi_tasks_${user.id}` : 'krishibhoomi_tasks';
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  }, [user?.id]);

  const [activities, setActivities] = useState<FarmActivity[]>(initialActivities);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newField, setNewField] = useState(fieldOptions[0] || 'Block A');

  // Reset activities when user changes
  useEffect(() => {
    setActivities(initialActivities);
    setNewField(fieldOptions[0] || 'Block A');
  }, [user?.id, initialActivities, fieldOptions]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const newTask: FarmActivity = {
      id: `act-${Date.now()}`,
      taskName: newTaskName.trim(),
      assignedField: newField,
      category: 'Fertilizer Plan',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending',
    };

    const updated = [newTask, ...activities];
    setActivities(updated);
    if (user?.id) {
      try {
        localStorage.setItem(`krishibhoomi_tasks_${user.id}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    setNewTaskName('');
    setShowAddModal(false);
  };

  const getStatusBadge = (status: FarmActivity['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32]">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E3F2FD] text-[#1565C0]">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFF8E1] text-[#E65100]">
            <AlertCircle className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-extrabold text-base text-[#37474F]">Task & Advisory Management</h3>
          <p className="text-xs text-gray-400">
            Scheduled field tasks for {user?.name || 'Farmer'} ({farmArea > 0 ? `${farmArea} Acres` : 'Holding'})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Task
          </button>
        </div>
      </div>

      {/* Activities Table or Zero State */}
      {activities.length === 0 ? (
        <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-xl p-8 text-center my-2 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mb-2.5">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#37474F]">No Farm Tasks Scheduled</h4>
          <p className="text-xs text-gray-500 mt-1 mb-4 max-w-sm leading-relaxed">
            As you upload your Soil Health Card or configure crop schedules, Krishibhoomi AI automatically generates prioritized field advisories. You can also manually add your own tasks.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Your First Task
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#37474F]">
            <thead className="bg-[#F7FBF7] text-gray-500 font-bold uppercase tracking-wider text-[10px] border-y border-[#E0E0E0]">
              <tr>
                <th className="py-3 px-3">Task Name</th>
                <th className="py-3 px-3">Assigned Field</th>
                <th className="py-3 px-3">Due / Date</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-[#F1F8E9]/40 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-[#37474F]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                      {item.taskName}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-gray-600">{item.assignedField}</td>
                  <td className="py-3.5 px-3 font-medium text-gray-500">{item.date}</td>
                  <td className="py-3.5 px-3">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E0E0E0] shadow-xl">
            <h4 className="font-bold text-lg text-[#37474F] mb-3">Add Farm Task</h4>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Task Description</label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g. Apply Recommended Zinc Sulphate"
                  className="w-full px-3 py-2 border border-[#E0E0E0] rounded-xl text-xs focus:border-[#2E7D32] outline-hidden"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Target Field / Crop</label>
                <select
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E0E0E0] rounded-xl text-xs focus:border-[#2E7D32] outline-hidden bg-white"
                >
                  {fieldOptions.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const HarvestSummary: React.FC = () => {
  const { user } = useAuth();
  const farmArea = user?.farmArea ?? 0;
  const hasSoilData = soilAnalysisService.hasUserUploadedSoil(user);
  const hasData = false; // Dashboard projections require a real saved record; never show demo projections.

  const { harvests, cumulativeYield } = useMemo(() => {
    if (!hasData) {
      return { harvests: [], cumulativeYield: 0 };
    }

    let cropA = 'Soybean';
    let cropB = 'Nagpur Orange';
    let cropC = 'Bt Cotton';
    let cropD = 'Desi Chana';

    if (user?.preferredCrop) {
      const parts = user.preferredCrop.split('&').map((s) => s.trim());
      if (parts[0]) cropA = parts[0];
      if (parts[1]) cropB = parts[1];
    } else if (user?.soilType?.includes('Red')) {
      cropA = 'Groundnut';
      cropB = 'Red Gram';
      cropC = 'Maize';
      cropD = 'Black Gram';
    }

    // Scale yield amounts proportionally to farmer's acreage
    const scale = (farmArea || 12.5) / 12.5;
    const aAmt = Math.max(10, Math.round(320 * scale));
    const aTgt = Math.max(12, Math.round(340 * scale));
    const bAmt = Math.max(8, Math.round(240 * scale));
    const bTgt = Math.max(10, Math.round(250 * scale));
    const cAmt = Math.max(6, Math.round(160 * scale));
    const cTgt = Math.max(7, Math.round(175 * scale));
    const dAmt = Math.max(4, Math.round(110 * scale));
    const dTgt = Math.max(5, Math.round(120 * scale));

    const total = aAmt + bAmt + cAmt + dAmt;

    const list = [
      { name: cropA, amount: `${aAmt} quintals`, target: `${aTgt} quintals`, progress: Math.round((aAmt / aTgt) * 100), color: '#2E7D32' },
      { name: cropB, amount: `${bAmt} quintals`, target: `${bTgt} quintals`, progress: Math.round((bAmt / bTgt) * 100), color: '#1E88E5' },
      { name: cropC, amount: `${cAmt} quintals`, target: `${cTgt} quintals`, progress: Math.round((cAmt / cTgt) * 100), color: '#8E24AA' },
      { name: cropD, amount: `${dAmt} quintals`, target: `${dTgt} quintals`, progress: Math.round((dAmt / dTgt) * 100), color: '#00897B' },
    ];

    return { harvests: list, cumulativeYield: total };
  }, [user, farmArea, hasData]);

  if (!hasData) {
    return (
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full min-h-[310px]">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-[#37474F]">Crop Harvest Summary</h3>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              0 Logged
            </span>
          </div>

          <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-xl p-6 text-center my-6 flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mb-2.5">
              <PackageOpen className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-[#37474F]">No Harvest Records Logged</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-xs leading-relaxed">
              Harvest outputs and storage balances will track progress against your seasonal targets once crops reach maturity.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium">Cumulative Harvest ({farmArea > 0 ? `${farmArea} Acres` : 'Holding'})</span>
          <span className="font-black text-gray-400 text-sm">0 Quintals</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base text-[#37474F]">Crop Harvest Summary</h3>
          <span className="text-[11px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
            Season 2026 Total
          </span>
        </div>

        <div className="space-y-4">
          {harvests.map((crop) => (
            <div key={crop.name} className="flex items-center justify-between pb-2 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-2xs"
                  style={{ backgroundColor: crop.color }}
                >
                  {crop.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#37474F]">{crop.name}</h4>
                  <p className="text-[11px] text-gray-400">Target: {crop.target}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-[#37474F]">{crop.amount}</span>
                <p className="text-[10px] font-bold text-[#2E7D32]">{crop.progress}% met</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-500 font-medium">Cumulative Harvest ({farmArea} Acres)</span>
        <span className="font-black text-[#2E7D32] text-sm">{cumulativeYield.toLocaleString()} Quintals</span>
      </div>
    </div>
  );
};
