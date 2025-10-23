import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Capture } from '../lib/supabase';
import { Plus, Phone, Heart, MessageCircle, Video, Play, Square, Sparkles, FolderOpen, BarChart3, TrendingUp, Clock } from 'lucide-react';
import { NewCaptureModal } from '../components/NewCaptureModal';
import { generateMockDataForCapture } from '../utils/mockDataGenerator';

type TabView = 'captures' | 'activity' | 'analytics';

export const Dashboard: React.FC<{
  onNavigateToCapture: (captureId: string) => void;
  sidebarOpen: boolean;
}> = ({ onNavigateToCapture, sidebarOpen }) => {
  const { user } = useAuth();
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCaptureModal, setShowNewCaptureModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabView>('captures');

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

  const totalPhoneNumbers = captures.reduce((sum, c) => sum + c.phone_numbers_count, 0);
  const totalLikes = captures.reduce((sum, c) => sum + c.likes_count, 0);
  const totalComments = captures.reduce((sum, c) => sum + c.comments_count, 0);
  const activeCaptures = captures.filter(c => c.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor and manage your TikTok captures</p>
          </div>

          <button
            onClick={() => setShowNewCaptureModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Start New Capture</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('captures')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold text-base transition-all relative ${
                activeTab === 'captures'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Video className="w-5 h-5" />
              <span>Captures</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                {captures.length}
              </span>
              {activeTab === 'captures' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold text-base transition-all relative ${
                activeTab === 'activity'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span>Activity</span>
              {activeTab === 'activity' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold text-base transition-all relative ${
                activeTab === 'analytics'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
              {activeTab === 'analytics' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
              )}
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'captures' && (
              <div>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : captures.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                        <Video className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No captures yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first capture to start monitoring phone numbers</p>
                    <button
                      onClick={() => setShowNewCaptureModal(true)}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Start New Capture</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {captures.map((capture) => (
                      <div
                        key={capture.id}
                        onClick={() => onNavigateToCapture(capture.id)}
                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer group"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                              {capture.title}
                            </h3>
                            <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2 ${
                              capture.status === 'active'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}>
                              {capture.status === 'active' ? 'LIVE' : 'STOPPED'}
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Numbers</span>
                              </div>
                              <span className="text-lg font-bold text-gray-900 dark:text-white">{capture.phone_numbers_count}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="flex items-center space-x-1.5">
                                  <Heart className="w-3.5 h-3.5 text-red-500" />
                                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Likes</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{capture.likes_count}</span>
                              </div>

                              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <div className="flex items-center space-x-1.5">
                                  <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Comments</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{capture.comments_count}</span>
                              </div>
                            </div>
                          </div>

                          {capture.pages && capture.pages.length > 0 && (
                            <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                              <div className="flex flex-wrap gap-1.5">
                                {capture.pages.map((page) => (
                                  <span
                                    key={page.id}
                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                  >
                                    {page.page_name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            Started {new Date(capture.started_at).toLocaleDateString()} at{' '}
                            {new Date(capture.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (capture.status === 'active') {
                                  handleStopCapture(capture.id);
                                } else {
                                  handleStartCapture(capture.id);
                                }
                              }}
                              className={`flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                                capture.status === 'active'
                                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800'
                                  : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800'
                              }`}
                            >
                              {capture.status === 'active' ? (
                                <>
                                  <Square className="w-3.5 h-3.5" />
                                  <span>Stop</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5" />
                                  <span>Resume</span>
                                </>
                              )}
                            </button>

                            {capture.phone_numbers_count === 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGenerateMockData(capture.id);
                                }}
                                className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Demo</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                {captures.filter(c => c.status === 'active').length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                        <Clock className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No active captures</h3>
                    <p className="text-gray-600 dark:text-gray-400">Start a capture to see activity here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {captures
                      .filter(c => c.status === 'active')
                      .map((capture) => (
                        <div
                          key={capture.id}
                          onClick={() => onNavigateToCapture(capture.id)}
                          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{capture.title}</h3>
                            <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 animate-pulse">
                              ● LIVE
                            </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="font-semibold text-gray-900 dark:text-white">{capture.phone_numbers_count}</span>
                              <span className="text-gray-600 dark:text-gray-400">numbers</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="font-semibold text-gray-900 dark:text-white">{capture.comments_count}</span>
                              <span className="text-gray-600 dark:text-gray-400">comments</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Analytics Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50 p-5">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-blue-600 dark:bg-blue-500 p-2.5 rounded-lg">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Total Numbers</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalPhoneNumbers}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50 p-5">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-green-600 dark:bg-green-500 p-2.5 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100">Active Captures</p>
                    </div>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{activeCaptures}</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50 p-5">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-red-600 dark:bg-red-500 p-2.5 rounded-lg">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-red-900 dark:text-red-100">Total Likes</p>
                    </div>
                    <p className="text-3xl font-bold text-red-900 dark:text-red-100">{totalLikes}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800/50 p-5">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-purple-600 dark:bg-purple-500 p-2.5 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Total Comments</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{totalComments}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Capture Performance</h3>
                  {captures.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No data available</p>
                  ) : (
                    <div className="space-y-3">
                      {captures.slice(0, 5).map((capture) => (
                        <div key={capture.id} className="flex items-center justify-between py-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{capture.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(capture.started_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 ml-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">{capture.phone_numbers_count}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">numbers</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
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
