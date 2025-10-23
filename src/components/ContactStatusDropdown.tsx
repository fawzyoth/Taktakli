import React, { useState } from 'react';
import { Check, Phone, PhoneOff, PhoneMissed, PhoneCall, XCircle, Clock, AlertCircle } from 'lucide-react';
import { ContactStatus, supabase } from '../lib/supabase';

interface StatusOption {
  value: ContactStatus;
  label: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  description: string;
}

const statusOptions: StatusOption[] = [
  {
    value: 'not_called',
    label: 'Not Called',
    icon: <Phone className="w-4 h-4" />,
    colorClass: 'text-gray-700 dark:text-gray-300',
    bgClass: 'bg-gray-100 dark:bg-gray-800',
    borderClass: 'border-gray-300 dark:border-gray-600',
    description: 'No contact attempted yet',
  },
  {
    value: 'called_no_answer',
    label: 'Called - No Answer',
    icon: <PhoneMissed className="w-4 h-4" />,
    colorClass: 'text-yellow-700 dark:text-yellow-300',
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
    borderClass: 'border-yellow-400 dark:border-yellow-600',
    description: 'Call made but no response',
  },
  {
    value: 'called_answered',
    label: 'Called - Answered',
    icon: <PhoneCall className="w-4 h-4" />,
    colorClass: 'text-blue-700 dark:text-blue-300',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    borderClass: 'border-blue-400 dark:border-blue-600',
    description: 'Contact made and responded',
  },
  {
    value: 'confirmed',
    label: 'Confirmed',
    icon: <Check className="w-4 h-4" />,
    colorClass: 'text-green-700 dark:text-green-300',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    borderClass: 'border-green-400 dark:border-green-600',
    description: 'Final confirmation received',
  },
  {
    value: 'declined',
    label: 'Declined',
    icon: <XCircle className="w-4 h-4" />,
    colorClass: 'text-red-700 dark:text-red-300',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    borderClass: 'border-red-400 dark:border-red-600',
    description: 'Person declined or refused',
  },
  {
    value: 'callback_requested',
    label: 'Callback Requested',
    icon: <Clock className="w-4 h-4" />,
    colorClass: 'text-purple-700 dark:text-purple-300',
    bgClass: 'bg-purple-100 dark:bg-purple-900/30',
    borderClass: 'border-purple-400 dark:border-purple-600',
    description: 'Asked to be contacted later',
  },
  {
    value: 'invalid_contact',
    label: 'Invalid Contact',
    icon: <AlertCircle className="w-4 h-4" />,
    colorClass: 'text-orange-700 dark:text-orange-300',
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
    borderClass: 'border-orange-400 dark:border-orange-600',
    description: 'Phone number doesn\'t work',
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: <Check className="w-4 h-4" />,
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderClass: 'border-emerald-400 dark:border-emerald-600',
    description: 'Process fully finished',
  },
];

interface ContactStatusDropdownProps {
  phoneNumberId: string;
  currentStatus: ContactStatus;
  onStatusChange?: (newStatus: ContactStatus) => void;
}

export const ContactStatusDropdown: React.FC<ContactStatusDropdownProps> = ({
  phoneNumberId,
  currentStatus,
  onStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const currentOption = statusOptions.find((opt) => opt.value === currentStatus) || statusOptions[0];

  const handleStatusChange = async (newStatus: ContactStatus) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('detected_phone_numbers')
        .update({ contact_status: newStatus })
        .eq('id', phoneNumberId);

      if (!error) {
        onStatusChange?.(newStatus);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={updating}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-all duration-200 hover:shadow-md ${
          currentOption.colorClass
        } ${currentOption.bgClass} ${currentOption.borderClass} ${
          updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {currentOption.icon}
        <span>{currentOption.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            <div className="py-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    option.value === currentStatus ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 p-2 rounded-lg ${option.bgClass}`}>
                    <div className={option.colorClass}>{option.icon}</div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-semibold text-sm ${option.colorClass}`}>{option.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {option.description}
                    </div>
                  </div>
                  {option.value === currentStatus && (
                    <Check className="w-5 h-5 text-gray-900 dark:text-gray-100 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
