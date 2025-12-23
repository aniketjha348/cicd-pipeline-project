import React, { useState } from 'react';
import { 
  useGetClassesQuery, 
  useCreateClassMutation,
  useGetActiveSessionQuery,
  useAddSectionMutation,
  useDeleteClassMutation
} from '@/services/SchoolErpService';
import { Plus, Users, Layers, Trash2, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Section {
  _id: string;
  name: string;
  classTeacher?: { name: string; email: string };
  capacity: number;
}

interface ClassData {
  _id: string;
  name: string;
  displayOrder: number;
  sections: Section[];
  monthlyFee: number;
  isActive: boolean;
}

const ClassManagement: React.FC = () => {
  const { data: activeSession } = useGetActiveSessionQuery({});
  const { data: classes, isLoading } = useGetClassesQuery(
    { academicSession: activeSession?._id },
    { skip: !activeSession }
  );
  const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
  const [addSection] = useAddSectionMutation();
  const [deleteClass] = useDeleteClassMutation();

  const [showForm, setShowForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState<string | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    displayOrder: 0,
    monthlyFee: 0,
    sections: [{ name: 'A', capacity: 40 }],
  });
  const [sectionData, setSectionData] = useState({ name: '', capacity: 40 });

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClass({
        ...formData,
        academicSession: activeSession?._id,
      }).unwrap();
      toast.success('Class created successfully');
      setShowForm(false);
      setFormData({ name: '', displayOrder: 0, monthlyFee: 0, sections: [{ name: 'A', capacity: 40 }] });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create class');
    }
  };

  const handleAddSection = async (classId: string) => {
    try {
      await addSection({ classId, ...sectionData }).unwrap();
      toast.success('Section added successfully');
      setShowSectionForm(null);
      setSectionData({ name: '', capacity: 40 });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add section');
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      await deleteClass(id).unwrap();
      toast.success('Class deleted');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete class');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Class Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Session: <span className="font-medium">{activeSession?.name}</span>
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Class
        </button>
      </div>

      {/* Create Class Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Class</h2>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Class 1, Grade 10"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Monthly Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial Section
                </label>
                <input
                  type="text"
                  value={formData.sections[0].name}
                  onChange={(e) => setFormData({
                    ...formData,
                    sections: [{ ...formData.sections[0], name: e.target.value }]
                  })}
                  placeholder="e.g., A"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classes List */}
      <div className="space-y-3">
        {classes?.map((cls: ClassData) => (
          <div
            key={cls._id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
              onClick={() => setExpandedClass(expandedClass === cls._id ? null : cls._id)}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{cls.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cls.sections.length} Section{cls.sections.length !== 1 ? 's' : ''} • ₹{cls.monthlyFee}/month
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClass(cls._id);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {expandedClass === cls._id ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Sections */}
            {expandedClass === cls._id && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">Sections</h4>
                  <button
                    onClick={() => setShowSectionForm(cls._id)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Section
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {cls.sections.map((section) => (
                    <div
                      key={section._id}
                      className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">Section {section.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Capacity: {section.capacity}</p>
                      {section.classTeacher && (
                        <p className="text-xs text-green-600 mt-1">CT: {section.classTeacher.name}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Section Form */}
                {showSectionForm === cls._id && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={sectionData.name}
                        onChange={(e) => setSectionData({ ...sectionData, name: e.target.value })}
                        placeholder="Section name (e.g., B)"
                        className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                      />
                      <input
                        type="number"
                        value={sectionData.capacity}
                        onChange={(e) => setSectionData({ ...sectionData, capacity: parseInt(e.target.value) })}
                        placeholder="Capacity"
                        className="w-24 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                      />
                      <button
                        onClick={() => handleAddSection(cls._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowSectionForm(null)}
                        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {classes?.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No classes found</p>
            <p className="text-sm">Create your first class to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;
