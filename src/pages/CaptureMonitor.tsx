import React, { useState, useEffect } from 'react';
import { supabase, Capture, DetectedPhoneNumber, PhoneNumberComment } from '../lib/supabase';
import { ArrowLeft, Phone, Heart, MessageCircle, Users, Clock, TrendingUp } from 'lucide-react';
import { ContactStatusDropdown } from '../components/ContactStatusDropdown';

interface CaptureMonitorProps {
  captureId: string;
  onBack: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

type FeedItem = {
  id: string;
  type: 'phone' | 'chat' | 'stats';
  timestamp: Date;
  data: any;
};

export const CaptureMonitor: React.FC<CaptureMonitorProps> = ({ captureId, onBack, sidebarOpen, onToggleSidebar }) => {
  const [capture, setCapture] = useState<Capture | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<(DetectedPhoneNumber & { comments: PhoneNumberComment[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

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

  useEffect(() => {
    const items: FeedItem[] = [];

    phoneNumbers.forEach((phoneData) => {
      items.push({
        id: `phone-${phoneData.id}`,
        type: 'phone',
        timestamp: new Date(phoneData.detected_at),
        data: phoneData,
      });

      phoneData.comments?.forEach((comment) => {
        items.push({
          id: `chat-${comment.id}`,
          type: 'chat',
          timestamp: new Date(comment.created_at),
          data: {
            ...comment,
            username: phoneData.username,
            phone_number: phoneData.phone_number,
          },
        });
      });
    });

    items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setFeedItems(items);
  }, [phoneNumbers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'called_answered': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'callback_requested': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      case 'declined': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'called_no_answer': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'completed': return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'invalid_contact': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      default: return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getTimeLabel = (timestamp: Date, index: number, items: FeedItem[]) => {
    if (index === 0) return formatTimeAgo(timestamp);

    const prevTimestamp = items[index - 1].timestamp;
    const diffMinutes = Math.floor((prevTimestamp.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffMinutes > 10) {
      return formatTimeAgo(timestamp);
    }
    return null;
  };

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
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Captures</span>
          </button>

          <div className="flex items-center justify-between mb-6">
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

          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <Phone className="w-5 h-5 opacity-80" />
                <TrendingUp className="w-4 h-4 opacity-60" />
              </div>
              <p className="text-2xl font-bold">{capture.phone_numbers_count}</p>
              <p className="text-xs opacity-80 font-medium">Numbers</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <Heart className="w-5 h-5 opacity-80" />
                <TrendingUp className="w-4 h-4 opacity-60" />
              </div>
              <p className="text-2xl font-bold">{capture.likes_count.toLocaleString()}</p>
              <p className="text-xs opacity-80 font-medium">Likes</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <MessageCircle className="w-5 h-5 opacity-80" />
                <TrendingUp className="w-4 h-4 opacity-60" />
              </div>
              <p className="text-2xl font-bold">{capture.comments_count.toLocaleString()}</p>
              <p className="text-xs opacity-80 font-medium">Comments</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <Users className="w-5 h-5 opacity-80" />
                <TrendingUp className="w-4 h-4 opacity-60" />
              </div>
              <p className="text-2xl font-bold">
                {capture.comments_count > 0
                  ? Math.round((capture.phone_numbers_count / capture.comments_count) * 100)
                  : 0}%
              </p>
              <p className="text-xs opacity-80 font-medium">Rate</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {feedItems.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                  <MessageCircle className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No activity yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {capture.status === 'active'
                  ? 'Activity will appear here as it happens'
                  : 'This capture has been stopped'}
              </p>
            </div>
          ) : (
            feedItems.map((item, index) => {
              const timeLabel = getTimeLabel(item.timestamp, index, feedItems);

              return (
                <React.Fragment key={item.id}>
                  {timeLabel && (
                    <div className="flex items-center justify-center py-4">
                      <div className="flex items-center space-x-3 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          {timeLabel}
                        </span>
                      </div>
                    </div>
                  )}

                  {item.type === 'phone' && (
                    <div
                      className={`rounded-xl border-2 p-5 transition-all duration-300 hover:shadow-lg animate-slideUp ${getStatusColor(item.data.contact_status)}`}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                            {item.data.username ? item.data.username.charAt(0).toUpperCase() : '?'}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-bold text-gray-900 dark:text-white">
                                {item.data.username || 'Anonymous User'}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-semibold">
                                NEW
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                              <span className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                                {item.data.phone_number}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <ContactStatusDropdown
                          phoneNumberId={item.data.id}
                          currentStatus={item.data.contact_status}
                          onStatusChange={(newStatus) => {
                            setPhoneNumbers(prev => prev.map(pn =>
                              pn.id === item.data.id
                                ? { ...pn, contact_status: newStatus, status_updated_at: new Date().toISOString() }
                                : pn
                            ));
                          }}
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.data.detected_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'chat' && (
                    <div
                      className="flex items-start space-x-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all animate-fadeIn"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {item.data.username ? item.data.username.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline space-x-2 mb-1">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">
                            {item.data.username || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {item.data.phone_number}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                          {item.data.comment_text}
                        </p>
                      </div>
                      <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
