import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Capture } from '../lib/supabase';
import { Plus, Phone, Heart, MessageCircle, Video, Play, Square, Sparkles, FolderOpen } from 'lucide-react';
import { NewCaptureModal } from '../components/NewCaptureModal';
import { generateMockDataForCapture } from '../utils/mockDataGenerator';

export const Dashboard: React.FC<{
  onNavigateToCapture: (captureId: string) => void;
  sidebarOpen: boolean;
}> = ({ onNavigateToCapture, sidebarOpen }) => {
  const { user } = useAuth();
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCaptureModal, setShowNewCaptureModal] = useState(false);

  const loadCaptures = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('captures')
      .select(`
        *,
        pages:capture_pages(page:pages(*))
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const capturesWithPages = data.map(capture => ({
        ...capture,
        pages: capture.pages?.map((cp: any) => cp.page).filter(Boolean) || []
      }));
      setCaptures(capturesWithPages);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCaptures();
  }, [user]);

  const handleCaptureCreated = () => {
    setShowNewCaptureModal(false);
    loadCaptures();
  };

  const handleStopCapture = async (captureId: string) => {
    await supabase
      .from('captures')
      .update({ status: 'stopped', stopped_at: new Date().toISOString() })
      .eq('id', captureId);

    loadCaptures();
  };

  const handleStartCapture = async (captureId: string) => {
    await supabase
      .from('captures')
      .update({ status: 'active', stopped_at: null })
      .eq('id', captureId);

    loadCaptures();
  };

  const handleGenerateMockData = async (captureId: string) => {
    if (!user) return;

    await generateMockDataForCapture(captureId, user.id);
    loadCaptures();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Captures</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor and manage your live TikTok captures</p>
          </div>

          <button
            onClick={() => setShowNewCaptureModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
          >
            <Plus className="w-5 h-5" />
            <span>Start New Capture</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : captures.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No captures yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first capture to start monitoring phone numbers</p>
            <button
              onClick={() => setShowNewCaptureModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
            >
              <Plus className="w-5 h-5" />
              <span>Start New Capture</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {captures.map((capture) => (
              <div
                key={capture.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => onNavigateToCapture(capture.id)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {capture.title}
                    </h3>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      capture.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {capture.status}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-100 dark:border-blue-900">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Phone Numbers</span>
                      </div>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{capture.phone_numbers_count}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">Likes</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">{capture.likes_count}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">Comments</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">{capture.comments_count}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                    {capture.pages && capture.pages.length > 0 && (
                      <div className="flex items-start space-x-2">
                        <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Monitoring:</p>
                          <div className="flex flex-wrap gap-1">
                            {capture.pages.map((page, idx) => (
                              <span
                                key={page.id}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              >
                                {page.page_name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Started {new Date(capture.started_at).toLocaleDateString()} at{' '}
                      {new Date(capture.started_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (capture.status === 'active') {
                        handleStopCapture(capture.id);
                      } else {
                        handleStartCapture(capture.id);
                      }
                    }}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                      capture.status === 'active'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                    }`}
                  >
                    {capture.status === 'active' ? (
                      <>
                        <Square className="w-4 h-4" />
                        <span>Stop Capture</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Resume Capture</span>
                      </>
                    )}
                  </button>

                  {capture.phone_numbers_count === 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateMockData(capture.id);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Demo Data</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNewCaptureModal && (
        <NewCaptureModal
          onClose={() => setShowNewCaptureModal(false)}
          onCaptureCreated={handleCaptureCreated}
        />
      )}
    </div>
  );
};
