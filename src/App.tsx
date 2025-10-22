import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CaptureMonitor } from './pages/CaptureMonitor';
import { Pages } from './pages/Pages';
import { Sidebar } from './components/Sidebar';
import { Menu, Video, LogOut } from 'lucide-react';

type View = 'dashboard' | 'captures' | 'pages' | 'capture';

const AppContent = () => {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCaptureId, setSelectedCaptureId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    if (!user) {
      setCurrentView('dashboard');
      setSelectedCaptureId(null);
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigateToCapture = (captureId: string) => {
    setSelectedCaptureId(captureId);
    setCurrentView('capture');
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleNavigateToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCaptureId(null);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleNavigateToCaptures = () => {
    setCurrentView('captures');
    setSelectedCaptureId(null);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleNavigateToPages = () => {
    setCurrentView('pages');
    setSelectedCaptureId(null);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-30">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition lg:hover:bg-blue-50"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="bg-blue-500 p-2 rounded-lg">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">TikTok Capture</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-400 text-sm hidden md:block">{user?.email}</span>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToCaptures={handleNavigateToCaptures}
        onNavigateToPages={handleNavigateToPages}
        currentView={currentView === 'capture' ? 'captures' : currentView}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {currentView === 'capture' && selectedCaptureId ? (
          <CaptureMonitor
            captureId={selectedCaptureId}
            onBack={handleNavigateToCaptures}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        ) : currentView === 'captures' || currentView === 'dashboard' ? (
          <Dashboard
            onNavigateToCapture={handleNavigateToCapture}
            sidebarOpen={sidebarOpen}
          />
        ) : currentView === 'pages' ? (
          <Pages onNavigateToCaptures={handleNavigateToCaptures} />
        ) : null}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
