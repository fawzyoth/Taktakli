import React, { useState, useEffect } from 'react';
import { supabase, Capture, DetectedPhoneNumber, PhoneNumberComment } from '../lib/supabase';
import { ArrowLeft, Phone, Heart, MessageCircle, Users, BarChart3, Hash } from 'lucide-react';
import { ContactStatusDropdown } from '../components/ContactStatusDropdown';

interface CaptureMonitorProps {
  captureId: string;
  onBack: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

type TabView = 'numbers' | 'chat' | 'stats';

export const CaptureMonitor: React.FC<CaptureMonitorProps> = ({ captureId, onBack, sidebarOpen, onToggleSidebar }) => {
  const [capture, setCapture] = useState<Capture | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<(DetectedPhoneNumber & { comments: PhoneNumberComment[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabView>('numbers');
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

        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex border-b-2 border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('numbers')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold text-base transition-all relative ${
                activeTab === 'numbers'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Phone className="w-5 h-5" />
              <span>Numbers</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                {phoneNumbers.length}
              </span>
              {activeTab === 'numbers' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold text-base transition-all relative ${
                activeTab === 'chat'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                {phoneNumbers.filter(p => p.comments?.length > 0).length}
              </span>
              {activeTab === 'chat' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold text-base transition-all relative ${
                activeTab === 'stats'
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Stats</span>
              {activeTab === 'stats' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-t-full" />
              )}
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'numbers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detected Phone Numbers</h2>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total: <span className="font-bold text-gray-900 dark:text-white">{phoneNumbers.length}</span>
                  </div>
                </div>

                {phoneNumbers.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                        <Phone className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No phone numbers detected yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {capture.status === 'active'
                        ? 'Phone numbers will appear here as they are detected from the live stream'
                        : 'This capture has been stopped'}
                    </p>
                  </div>
                ) : (
                  phoneNumbers.map((phoneData) => (
                    <div
                      key={phoneData.id}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start space-x-4 flex-1 min-w-0">
                            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm">
                              <Hash className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                                  {phoneData.phone_number}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                  #{phoneData.sequence_number}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <div className="flex items-center space-x-2">
                                  <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold text-xs">
                                    {phoneData.username ? phoneData.username.charAt(0).toUpperCase() : '?'}
                                  </div>
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    {phoneData.username || 'Anonymous'}
                                  </span>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400">•</span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  {new Date(phoneData.detected_at).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <ContactStatusDropdown
                              phoneNumberId={phoneData.id}
                              currentStatus={phoneData.contact_status}
                              onStatusChange={(newStatus) => {
                                setPhoneNumbers(prev => prev.map(pn =>
                                  pn.id === phoneData.id
                                    ? { ...pn, contact_status: newStatus, status_updated_at: new Date().toISOString() }
                                    : pn
                                ));
                              }}
                            />
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Updated: {new Date(phoneData.status_updated_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Chat</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {phoneNumbers.reduce((sum, p) => sum + (p.comments?.length || 0), 0)} messages
                    </span>
                  </div>
                </div>

                {phoneNumbers.filter(p => p.comments?.length > 0).length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                        <MessageCircle className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No chat messages yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Messages will appear here when users comment
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 max-h-[600px] overflow-y-auto">
                    <div className="space-y-3">
                      {phoneNumbers
                        .filter(p => p.comments?.length > 0)
                        .flatMap((phoneData) =>
                          phoneData.comments.map((comment) => ({
                            ...comment,
                            username: phoneData.username,
                            phone_number: phoneData.phone_number,
                            sequence_number: phoneData.sequence_number
                          }))
                        )
                        .map((message, idx) => (
                          <div
                            key={`${message.id}-${idx}`}
                            className="flex items-start space-x-2 animate-fade-in"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                              {message.username ? message.username.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline space-x-2">
                                <span className="font-bold text-sm text-gray-900 dark:text-white">
                                  {message.username || 'Anonymous'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                  {message.phone_number}
                                </span>
                              </div>
                              <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5 break-words leading-relaxed">
                                {message.comment_text}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Statistics</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50 p-5">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-blue-600 dark:bg-blue-500 p-2.5 rounded-lg">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Phone Numbers</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{capture.phone_numbers_count}</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50 p-5">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-red-600 dark:bg-red-500 p-2.5 rounded-lg">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-red-900 dark:text-red-100">Likes</p>
                    </div>
                    <p className="text-3xl font-bold text-red-900 dark:text-red-100">{capture.likes_count}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50 p-5">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-green-600 dark:bg-green-500 p-2.5 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100">Comments</p>
                    </div>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{capture.comments_count}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800/50 p-5">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-purple-600 dark:bg-purple-500 p-2.5 rounded-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Detection Rate</p>
                    </div>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                      {capture.comments_count > 0
                        ? Math.round((capture.phone_numbers_count / capture.comments_count) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Status Breakdown</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Not Called', count: phoneNumbers.filter(p => p.contact_status === 'not_called').length, color: 'bg-gray-500' },
                      { label: 'Called - No Answer', count: phoneNumbers.filter(p => p.contact_status === 'called_no_answer').length, color: 'bg-yellow-500' },
                      { label: 'Called - Answered', count: phoneNumbers.filter(p => p.contact_status === 'called_answered').length, color: 'bg-blue-500' },
                      { label: 'Confirmed', count: phoneNumbers.filter(p => p.contact_status === 'confirmed').length, color: 'bg-green-500' },
                      { label: 'Declined', count: phoneNumbers.filter(p => p.contact_status === 'declined').length, color: 'bg-red-500' },
                      { label: 'Callback Requested', count: phoneNumbers.filter(p => p.contact_status === 'callback_requested').length, color: 'bg-purple-500' },
                      { label: 'Invalid Contact', count: phoneNumbers.filter(p => p.contact_status === 'invalid_contact').length, color: 'bg-orange-500' },
                      { label: 'Completed', count: phoneNumbers.filter(p => p.contact_status === 'completed').length, color: 'bg-emerald-500' },
                    ].map((status) => (
                      <div key={status.label} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${status.color}`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{status.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
