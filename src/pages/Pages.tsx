import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Page } from '../lib/supabase';
import { Plus, FolderOpen, Edit, Trash2, Video } from 'lucide-react';

interface PagesProps {
  onNavigateToCaptures: () => void;
}

export const Pages: React.FC<PagesProps> = ({ onNavigateToCaptures }) => {
  const { user } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({ page_name: '', description: '' });

  const loadPages = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPages();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editingPage) {
      await supabase
        .from('pages')
        .update({
          page_name: formData.page_name,
          description: formData.description,
        })
        .eq('id', editingPage.id);
    } else {
      await supabase
        .from('pages')
        .insert({
          user_id: user.id,
          page_name: formData.page_name,
          description: formData.description,
        });
    }

    setFormData({ page_name: '', description: '' });
    setShowAddModal(false);
    setEditingPage(null);
    loadPages();
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({ page_name: page.page_name, description: page.description || '' });
    setShowAddModal(true);
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    await supabase.from('pages').delete().eq('id', pageId);
    loadPages();
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingPage(null);
    setFormData({ page_name: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">TikTok Pages</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your TikTok pages for monitoring</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onNavigateToCaptures}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition"
            >
              <Video className="w-5 h-5" />
              <span>View Captures</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Page</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : pages.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                <FolderOpen className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No pages yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first TikTok page to start monitoring</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Page</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <div
                key={page.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-lg flex-shrink-0">
                        <FolderOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {page.page_name}
                        </h3>
                        {page.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {page.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Added {new Date(page.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(page)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg font-medium transition border border-blue-200 dark:border-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg font-medium transition border border-red-200 dark:border-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPage ? 'Edit Page' : 'Add New Page'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Name *
                </label>
                <input
                  type="text"
                  value={formData.page_name}
                  onChange={(e) => setFormData({ ...formData, page_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter TikTok page name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition"
                >
                  {editingPage ? 'Update' : 'Add'} Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
