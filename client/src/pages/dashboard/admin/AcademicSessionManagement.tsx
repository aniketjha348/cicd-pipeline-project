import React, { useState } from 'react';
import { 
  useGetSessionsQuery, 
  useCreateSessionMutation, 
  useSetActiveSessionMutation,
  useUpdateSessionMutation
} from '@/services/SchoolErpService';
import { Plus, Calendar, Check, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Session {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  description?: string;
}

const AcademicSessionManagement: React.FC = () => {
  const { data: sessions, isLoading } = useGetSessionsQuery({});
  const [createSession, { isLoading: isCreating }] = useCreateSessionMutation();
  const [setActive, { isLoading: isSettingActive }] = useSetActiveSessionMutation();
  const [updateSession] = useUpdateSessionMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSession) {
        await updateSession({ id: editingSession._id, ...formData }).unwrap();
        toast.success('Session updated successfully');
      } else {
        await createSession(formData).unwrap();
        toast.success('Session created successfully');
      }
      setShowForm(false);
      setEditingSession(null);
      setFormData({ name: '', startDate: '', endDate: '', description: '' });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save session');
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await setActive(id).unwrap();
      toast.success('Session activated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to activate session');
    }
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setFormData({
      name: session.name,
      startDate: session.startDate.split('T')[0],
      endDate: session.endDate.split('T')[0],
      description: session.description || '',
    });
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Sessions</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage academic years and sessions</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingSession(null);
            setFormData({ name: '', startDate: '', endDate: '', description: '' });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Session
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingSession ? 'Edit Session' : 'Create New Session'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Session Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., 2024-25"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={2}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSession(null);
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Saving...' : editingSession ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="grid gap-4">
        {sessions?.map((session: Session) => (
          <div
            key={session._id}
            className={`p-4 rounded-xl border-2 transition-all ${
              session.isActive
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  session.isActive ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Calendar className={`w-6 h-6 ${
                    session.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {session.name}
                    </h3>
                    {session.isActive && (
                      <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(session.startDate).toLocaleDateString()} - {new Date(session.endDate).toLocaleDateString()}
                  </p>
                  {session.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {session.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(session)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                {!session.isActive && (
                  <button
                    onClick={() => handleSetActive(session._id)}
                    disabled={isSettingActive}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-800 dark:text-green-300 rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Set Active
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {sessions?.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No academic sessions found</p>
            <p className="text-sm">Create your first session to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicSessionManagement;
