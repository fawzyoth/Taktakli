import React from 'react';
import {
  LayoutDashboard,
  Video,
  FolderOpen,
  Settings,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToCaptures: () => void;
  onNavigateToPages: () => void;
  currentView?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onNavigateToDashboard,
  onNavigateToCaptures,
  onNavigateToPages,
  currentView
}) => {
  const { signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)]
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 lg:translate-x-0
          flex flex-col
        `}
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Navigation Menu */}
        <nav className="flex-1 p-4" aria-label="Primary">
          <ul className="space-y-1" role="list">
            <li>
              <button
                onClick={onNavigateToDashboard}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3
                  rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                aria-current={currentView === 'dashboard' ? 'page' : undefined}
              >
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                <span>Dashboard</span>
              </button>
            </li>

            <li>
              <button
                onClick={onNavigateToCaptures}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3
                  rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${currentView === 'captures'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                aria-current={currentView === 'captures' ? 'page' : undefined}
              >
                <Video className="w-5 h-5 flex-shrink-0" />
                <span>Captures</span>
              </button>
            </li>

            <li>
              <button
                onClick={onNavigateToPages}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3
                  rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${currentView === 'pages'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                aria-current={currentView === 'pages' ? 'page' : undefined}
              >
                <FolderOpen className="w-5 h-5 flex-shrink-0" />
                <span>Pages</span>
              </button>
            </li>

            <li>
              <button
                onClick={() => {}}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3
                  rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${currentView === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                aria-current={currentView === 'settings' ? 'page' : undefined}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>Dark Mode</span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
