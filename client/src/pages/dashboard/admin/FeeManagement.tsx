import React, { useState } from 'react';
import { 
  useGetFeeStructuresQuery,
  useCreateFeeStructureMutation,
  useGetActiveSessionQuery,
  useGetClassesQuery,
  useCollectFeeMutation,
  useGetPendingDuesQuery,
  useGetFeeSummaryQuery,
  useGetPaymentsQuery
} from '@/services/SchoolErpService';
import { Plus, IndianRupee, Receipt, AlertCircle, Loader2, TrendingUp, Users, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const FeeManagement: React.FC = () => {
  const { data: activeSession } = useGetActiveSessionQuery({});
  const { data: classes } = useGetClassesQuery(
    { academicSession: activeSession?._id },
    { skip: !activeSession }
  );
  const { data: feeStructures, isLoading: loadingStructures } = useGetFeeStructuresQuery(
    { academicSession: activeSession?._id },
    { skip: !activeSession }
  );
  const { data: pendingDues } = useGetPendingDuesQuery(
    { academicSession: activeSession?._id },
    { skip: !activeSession }
  );
  const { data: summary } = useGetFeeSummaryQuery(
    { academicSession: activeSession?._id },
    { skip: !activeSession }
  );
  const { data: recentPayments } = useGetPaymentsQuery(
    {},
    { skip: !activeSession }
  );

  const [createFeeStructure, { isLoading: isCreating }] = useCreateFeeStructureMutation();
  const [collectFee, { isLoading: isCollecting }] = useCollectFeeMutation();

  const [activeTab, setActiveTab] = useState<'overview' | 'structures' | 'collect' | 'dues'>('overview');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    class: '',
    feeType: 'monthly',
    dueDay: 10,
    description: '',
    appliesToAllClasses: false,
  });

  const handleCreateStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFeeStructure({
        ...formData,
        academicSession: activeSession?._id,
        class: formData.appliesToAllClasses ? undefined : formData.class,
      }).unwrap();
      toast.success('Fee structure created');
      setShowForm(false);
      setFormData({ name: '', amount: 0, class: '', feeType: 'monthly', dueDay: 10, description: '', appliesToAllClasses: false });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create fee structure');
    }
  };

  if (!activeSession) {
    return (
      <div className="p-6">
        <div className="text-center py-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
          <p className="text-yellow-700 dark:text-yellow-400 font-medium">
            Please create and activate an academic session first
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'structures', label: 'Fee Structures', icon: Receipt },
    { id: 'collect', label: 'Recent Payments', icon: CreditCard },
    { id: 'dues', label: 'Pending Dues', icon: AlertCircle },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage fee structures and collect payments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <IndianRupee className="w-6 h-6" />
              </div>
              <span className="text-lg font-medium">Total Collected</span>
            </div>
            <p className="text-3xl font-bold">₹{(summary?.collected?.totalCollected || 0).toLocaleString()}</p>
            <p className="text-green-100 text-sm mt-1">{summary?.collected?.count || 0} payments</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <span className="text-lg font-medium">Pending Dues</span>
            </div>
            <p className="text-3xl font-bold">₹{(summary?.pending?.totalPending || 0).toLocaleString()}</p>
            <p className="text-red-100 text-sm mt-1">{summary?.pending?.count || 0} students</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Receipt className="w-6 h-6" />
              </div>
              <span className="text-lg font-medium">Fee Structures</span>
            </div>
            <p className="text-3xl font-bold">{feeStructures?.length || 0}</p>
            <p className="text-blue-100 text-sm mt-1">Active structures</p>
          </div>
        </div>
      )}

      {/* Fee Structures Tab */}
      {activeTab === 'structures' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Fee Structure
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create Fee Structure</h2>
                <form onSubmit={handleCreateStructure} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Tuition Fee"
                      className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee Type</label>
                      <select
                        value={formData.feeType}
                        onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="half-yearly">Half-Yearly</option>
                        <option value="yearly">Yearly</option>
                        <option value="one-time">One-Time</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.appliesToAllClasses}
                        onChange={(e) => setFormData({ ...formData, appliesToAllClasses: e.target.checked })}
                        className="rounded"
                      />
                      Applies to all classes
                    </label>
                  </div>
                  {!formData.appliesToAllClasses && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                      <select
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required={!formData.appliesToAllClasses}
                      >
                        <option value="">Select Class</option>
                        {classes?.map((c: any) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isCreating ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {loadingStructures ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : feeStructures?.length > 0 ? (
              feeStructures.map((fee: any) => (
                <div key={fee._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <IndianRupee className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{fee.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {fee.appliesToAllClasses ? 'All Classes' : fee.class?.name} • {fee.feeType}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">₹{fee.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Due: Day {fee.dueDay}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No fee structures found</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Recent Payments Tab */}
      {activeTab === 'collect' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Receipt</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Fee Type</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentPayments?.slice(0, 20).map((payment: any) => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-sm font-mono text-blue-600">{payment.receiptNo}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 dark:text-white">{payment.student?.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({payment.student?.rollNo})</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{payment.feeStructure?.name}</td>
                    <td className="px-4 py-3 text-right font-medium text-green-600">₹{payment.amountPaid.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full capitalize">
                        {payment.paymentMode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pending Dues Tab */}
      {activeTab === 'dues' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {pendingDues?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Student</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Fee</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">Due Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {pendingDues.map((due: any) => (
                    <tr key={due._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900 dark:text-white">{due.student?.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{due.feeStructure?.name}</td>
                      <td className="px-4 py-3 text-right font-medium text-red-600">
                        ₹{(due.amountDue - due.amountPaid).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(due.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          due.status === 'overdue' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {due.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No pending dues found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
