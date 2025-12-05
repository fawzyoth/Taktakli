import React, { useState } from 'react';
import { X, Plus, Trash2, FolderOpen, AlertTriangle } from 'lucide-react';
import { supabase, Page } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PageManagementProps {
  onClose: () => void;
  pages: Page[];
}

export const PageManagement: React.FC<PageManagementProps> = ({ onClose, pages }) => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [pageName, setPageName] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pageName.trim()) {
      setError('Please enter a page name');
      return;
    }

    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase.from('pages').insert({
        user_id: user.id,
        page_name: pageName.trim(),
        page_url: pageUrl.trim() || null,
        description: description.trim() || null,
      });

      if (insertError) {
        setError(insertError.message);
      } else {
        setPageName('');
        setPageUrl('');
        setDescription('');
        setShowAddForm(false);
        onClose();
      }
    } catch (err) {
      setError('Failed to create page');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (deleteError) {
        setError(deleteError.message);
      } else {
        setDeleteConfirmId(null);
        onClose();
      }
    } catch (err) {
      setError('Failed to delete page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl border border-gray-200 animate-slideUp max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Pages</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg text-gray-600 hover:text-blue-600 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Page</span>
            </button>
          ) : (
            <form onSubmit={handleAddPage} className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">New Page</h3>

              <div>
                <label htmlFor="page-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Page Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="page-name"
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  placeholder="e.g., Main TikTok Account"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="page-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Page URL (Optional)
                </label>
                <input
                  id="page-url"
                  type="text"
                  value={pageUrl}
                  onChange={(e) => setPageUrl(e.target.value)}
                  placeholder="https://tiktok.com/@username"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add notes about this page..."
                  rows={3}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  disabled={loading}
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setPageName('');
                    setPageUrl('');
                    setDescription('');
                    setError('');
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !pageName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Page'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Your Pages ({pages.length})</h3>

            {pages.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-3">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <FolderOpen className="w-8 h-8 text-gray-500" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm">No pages yet. Add your first page above.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                  >
                    {deleteConfirmId === page.id ? (
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Delete this page?</p>
                            <p className="text-sm text-gray-600 mt-1">
                              This action cannot be undone. All captures associated with this page will remain.
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            disabled={loading}
                            className="flex-1 px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeletePage(page.id)}
                            disabled={loading}
                            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                          >
                            {loading ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900">{page.page_name}</h4>
                          {page.page_url && (
                            <a
                              href={page.page_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 truncate block mt-1"
                            >
                              {page.page_url}
                            </a>
                          )}
                          {page.description && (
                            <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            Created {new Date(page.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => setDeleteConfirmId(page.id)}
                          className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
