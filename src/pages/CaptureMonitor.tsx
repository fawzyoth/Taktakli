import React, { useState, useEffect } from 'react';
import { supabase, Capture, DetectedPhoneNumber, PhoneNumberComment } from '../lib/supabase';
import { ArrowLeft, Phone, Heart, MessageCircle, Users, ChevronDown, ChevronUp } from 'lucide-react';

interface CaptureMonitorProps {
  captureId: string;
  onBack: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const CaptureMonitor: React.FC<CaptureMonitorProps> = ({ captureId, onBack, sidebarOpen, onToggleSidebar }) => {
  const [capture, setCapture] = useState<Capture | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<(DetectedPhoneNumber & { comments: PhoneNumberComment[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyPhones, setShowOnlyPhones] = useState(false);
  const [selectedPhoneData, setSelectedPhoneData] = useState<(DetectedPhoneNumber & { comments: PhoneNumberComment[] }) | null>(null);

  const loadCapture = async () => {
    const { data, error } = await supabase
      .from('captures')
      .select('*')
      .eq('id', captureId)
      .maybeSingle();

    if (!error && data) {
      setCapture(data);
    }
  };

  const loadPhoneNumbers = async () => {
    const { data, error } = await supabase
      .from('detected_phone_numbers')
      .select(`
        *,
        comments:phone_number_comments(*)
      `)
      .eq('capture_id', captureId)
      .order('detected_at', { ascending: false });

    if (!error && data) {
      setPhoneNumbers(data as any);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadCapture(), loadPhoneNumbers()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadCapture();
      loadPhoneNumbers();
    }, 3000);

    return () => clearInterval(interval);
  }, [captureId]);

  const filteredPhoneNumbers = showOnlyPhones
    ? phoneNumbers.filter(pn => pn.comments && pn.comments.length > 0)
    : phoneNumbers;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!capture) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Capture not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Captures</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{capture.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {capture.status === 'active' ? 'Live monitoring' : 'Capture stopped'}
              </p>
            </div>

            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              capture.status === 'active'
                ? 'bg-green-100 text-green-700 animate-pulse'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {capture.status === 'active' ? '● LIVE' : 'STOPPED'}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Phone Numbers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{capture.phone_numbers_count}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 dark:bg-red-950 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Likes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{capture.likes_count}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-950 p-3 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Comments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{capture.comments_count}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Detection Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {capture.comments_count > 0
                    ? Math.round((capture.phone_numbers_count / capture.comments_count) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detected Phone Numbers</h2>

          <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">View:</span>
            <button
              onClick={() => setShowOnlyPhones(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                !showOnlyPhones
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              All Comments
            </button>
            <button
              onClick={() => setShowOnlyPhones(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                showOnlyPhones
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Only Phone Numbers
            </button>
          </div>
        </div>

        {filteredPhoneNumbers.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                <Phone className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {showOnlyPhones ? 'No phone numbers detected yet' : 'No data yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {capture.status === 'active'
                ? 'Phone numbers will appear here as they are detected from the live stream'
                : 'This capture has been stopped'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPhoneNumbers.map((phoneData) => {
              const hasComments = phoneData.comments && phoneData.comments.length > 0;
              const displayComments = phoneData.comments?.slice(0, 2);

              return (
                <div
                  key={phoneData.id}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {phoneData.username ? phoneData.username.charAt(0).toUpperCase() : '?'}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            {phoneData.username || 'Anonymous User'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(phoneData.detected_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-4 rounded-xl shadow-lg border-2 border-blue-400">
                          <div className="flex items-center space-x-3">
                            <Phone className="w-6 h-6 text-white" />
                            <span className="text-2xl font-bold text-white tracking-wide whitespace-nowrap">
                              {phoneData.phone_number}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {hasComments && (
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Comments ({phoneData.comments.length})
                          </h4>
                        </div>
                        {displayComments?.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                          >
                            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{comment.comment_text}</p>
                          </div>
                        ))}

                        {phoneData.comments.length > 2 && (
                          <button
                            onClick={() => setSelectedPhoneData(phoneData)}
                            className="w-full flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 px-4 py-3 rounded-lg text-sm font-medium transition border border-blue-200 dark:border-blue-800"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>See all {phoneData.comments.length} comments</span>
                          </button>
                        )}
                      </div>
                    )}

                    {!hasComments && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 text-center py-2">No comments associated</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedPhoneData && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {selectedPhoneData.username ? selectedPhoneData.username.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedPhoneData.username || 'Anonymous User'}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-lg font-bold text-blue-600">
                      {selectedPhoneData.phone_number}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPhoneData(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                  All Comments ({selectedPhoneData.comments.length})
                </h3>
              </div>
              <div className="space-y-3">
                {selectedPhoneData.comments.map((comment, index) => (
                  <div
                    key={comment.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Comment #{index + 1}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{comment.comment_text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedPhoneData(null)}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
