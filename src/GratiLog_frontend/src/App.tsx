import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CreateEntryModal from './components/CreateEntryModal';
import EntryCard from './components/EntryCard';
import StatsView from './components/StatsView';
import EmptyState from './components/EmptyState';
import { GratitudeEntry } from './types';

const AppContent: React.FC = () => {
  const { actor, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('public-entries');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [myEntries, setMyEntries] = useState<GratitudeEntry[]>([]);
  const [publicEntries, setPublicEntries] = useState<GratitudeEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Switch to my entries when user authenticates
  useEffect(() => {
    if (isAuthenticated && activeTab === 'public-entries') {
      setActiveTab('my-entries');
    }
  }, [isAuthenticated]);

  // Fetch entries when tab changes or actor is ready
  useEffect(() => {
    if (actor) {
      fetchEntries();
    }
  }, [actor, activeTab]);

  const fetchEntries = async () => {
    if (!actor) return;

    setEntriesLoading(true);
    setError(null);

    try {
      if (activeTab === 'my-entries') {
        const result = await actor.getMyEntries();
        if ('ok' in result) {
          setMyEntries(result.ok);
        } else {
          setError(result.err);
        }
      } else if (activeTab === 'public-entries') {
        const result = await actor.getPublicEntries();
        if ('ok' in result) {
          setPublicEntries(result.ok);
        } else {
          setError(result.err);
        }
      }
    } catch (err) {
      setError('Failed to fetch entries');
      console.error('Error fetching entries:', err);
    } finally {
      setEntriesLoading(false);
    }
  };

  const handleCreateEntry = () => {
    if (!isAuthenticated) {
      // Could show login modal or redirect
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleEntryCreated = () => {
    fetchEntries();
    if (activeTab !== 'my-entries') {
      setActiveTab('my-entries');
    }
  };

  const handleAppreciate = async (entryId: bigint) => {
    if (!actor) return;

    try {
      const result = await actor.appreciateEntry(entryId);
      if ('ok' in result) {
        // Refresh entries to show updated appreciation count
        fetchEntries();
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('Failed to appreciate entry');
      console.error('Error appreciating entry:', err);
    }
  };

  const handleDeleteEntry = async (entryId: bigint) => {
    if (!actor) return;

    try {
      const result = await actor.deleteEntry(entryId);
      if ('ok' in result) {
        // Refresh entries
        fetchEntries();
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('Failed to delete entry');
      console.error('Error deleting entry:', err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    if (activeTab === 'stats') {
      return <StatsView />;
    }

    if (entriesLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    const currentEntries = activeTab === 'my-entries' ? myEntries : publicEntries;

    if (currentEntries.length === 0) {
      return (
        <EmptyState
          type={activeTab as 'my-entries' | 'public-entries'}
          onCreateEntry={handleCreateEntry}
          isAuthenticated={isAuthenticated}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {currentEntries.map((entry, index) => (
            <motion.div
              key={Number(entry.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <EntryCard
                entry={entry}
                onAppreciate={activeTab === 'public-entries' ? handleAppreciate : undefined}
                onDelete={activeTab === 'my-entries' ? handleDeleteEntry : undefined}
                isOwner={activeTab === 'my-entries'}
                showAppreciateButton={activeTab === 'public-entries'}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateEntry={handleCreateEntry}
        isAuthenticated={isAuthenticated}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-sm mt-2"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {renderContent()}
      </main>

      <CreateEntryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleEntryCreated}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;