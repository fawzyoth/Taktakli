import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import { PhoneNumberComment } from '../lib/supabase';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: PhoneNumberComment[];
  phoneNumber: string;
  username: string;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  comments,
  phoneNumber,
  username,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-500" />
              Comments
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {username} - {phoneNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {comments.map((comment, idx) => (
              <div
                key={comment.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Comment #{idx + 1}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.comment_text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
