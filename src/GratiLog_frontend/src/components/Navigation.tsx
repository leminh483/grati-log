import React from 'react';
import { motion } from 'framer-motion';
import { Book, Globe, BarChart3, Plus } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateEntry: () => void;
  isAuthenticated: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  onCreateEntry, 
  isAuthenticated 
}) => {
  const tabs = [
    { id: 'my-entries', label: 'My Journal', icon: Book, requiresAuth: true },
    { id: 'public-entries', label: 'Community', icon: Globe, requiresAuth: false },
    { id: 'stats', label: 'Analytics', icon: BarChart3, requiresAuth: true },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDisabled = tab.requiresAuth && !isAuthenticated;
              
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                  whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                  onClick={() => !isDisabled && onTabChange(tab.id)}
                  disabled={isDisabled}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                      : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: isAuthenticated ? 1.05 : 1 }}
            whileTap={{ scale: isAuthenticated ? 0.95 : 1 }}
            onClick={onCreateEntry}
            disabled={!isAuthenticated}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${isAuthenticated
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <Plus className="h-5 w-5" />
            <span>New Entry</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;