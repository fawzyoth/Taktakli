import React, { useState, useEffect } from 'react';
import { X, Video, CheckSquare, Square } from 'lucide-react';
import { supabase, Page } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface NewCaptureModalProps {
  onClose: () => void;
  onCaptureCreated: () => void;
}

export const NewCaptureModal: React.FC<NewCaptureModalProps> = ({ onClose, onCaptureCreated }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    loadPages();
  }, [user]);

  const loadPages = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setPages(data);
    }
  };

  const togglePageSelection = (pageId: string) => {
    setSelectedPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a capture title');
      return;
    }

    if (selectedPages.size === 0) {
      setError('Please select at least one page to capture');
      return;
    }

    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      const { data: captureData, error: insertError } = await supabase
        .from('captures')
        .insert({
          user_id: user.id,
          title: title.trim(),
          status: 'active',
          likes_count: 0,
          comments_count: 0,
          phone_numbers_count: 0,
        })
        .select()
        .single();

      if (insertError || !captureData) {
        setError(insertError?.message || 'Failed to create capture');
        return;
      }

      const capturePages = Array.from(selectedPages).map((pageId) => ({
        capture_id: captureData.id,
        page_id: pageId,
      }));

      const { error: capturePagesError } = await supabase
        .from('capture_pages')
        .insert(capturePages);

      if (capturePagesError) {
        setError(capturePagesError.message);
      } else {
        onCaptureCreated();
      }
    } catch (err) {
      setError('Failed to create capture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg border border-gray-200 dark:border-gray-700 animate-slideUp max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Start New Capture</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="capture-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capture Title <span className="text-red-500">*</span>
            </label>
            <input
              id="capture-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Monday Evening Stream"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={loading}
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Give your capture a descriptive name to easily identify it later
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Pages to Capture <span className="text-red-500">*</span>
            </label>

            {pages.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">No pages available</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Please add pages in the sidebar before creating a capture
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pages.map((page) => {
                  const isSelected = selectedPages.has(page.id);
                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => togglePageSelection(page.id)}
                      disabled={loading}
                      className={`w-full flex items-start space-x-3 p-4 border-2 rounded-lg transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                      } disabled:opacity-50`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className={`font-medium ${isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                          {page.page_name}
                        </p>
                        {page.description && (
                          <p className={`text-sm mt-1 ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                            {page.description}
                          </p>
                        )}
                        {page.page_url && (
                          <p className={`text-xs mt-1 truncate ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {page.page_url}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedPages.size > 0 && (
              <p className="mt-3 text-sm text-blue-700 dark:text-blue-400 font-medium">
                {selectedPages.size} page{selectedPages.size !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        </form>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || selectedPages.size === 0}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Start Capture'}
          </button>
        </div>
      </div>
    </div>
  );
};
