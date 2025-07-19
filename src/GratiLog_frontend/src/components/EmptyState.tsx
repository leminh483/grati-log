import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Users, Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'my-entries' | 'public-entries' | 'stats';
  onCreateEntry?: () => void;
  isAuthenticated?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, onCreateEntry, isAuthenticated }) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'my-entries':
        return {
          icon: BookOpen,
          title: 'Start Your Gratitude Journey',
          description: 'You haven\'t written any gratitude entries yet. Start by creating your first entry and begin building a positive habit!',
          actionText: 'Create Your First Entry',
          showAction: true,
          gradient: 'from-purple-400 to-pink-400'
        };
      case 'public-entries':
        return {
          icon: Users,
          title: 'No Community Entries Yet',
          description: 'The community hasn\'t shared any public gratitude entries yet. Be the first to share your gratitude with others!',
          actionText: 'Share Your Gratitude',
          showAction: isAuthenticated,
          gradient: 'from-blue-400 to-cyan-400'
        };
      case 'stats':
        return {
          icon: Heart,
          title: 'No Stats Available',
          description: 'Your gratitude analytics will appear here once you start writing entries. The more you write, the more insights you\'ll gain!',
          actionText: 'Write Your First Entry',
          showAction: true,
          gradient: 'from-green-400 to-emerald-400'
        };
      default:
        return {
          icon: BookOpen,
          title: 'Nothing Here Yet',
          description: 'Start your journey by creating your first entry.',
          actionText: 'Get Started',
          showAction: true,
          gradient: 'from-gray-400 to-gray-500'
        };
    }
  };

  const { icon: Icon, title, description, actionText, showAction, gradient } = getEmptyStateContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className={`w-24 h-24 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}
      >
        <Icon className="w-12 h-12 text-white" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-900 mb-4"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 max-w-md mb-8 leading-relaxed"
      >
        {description}
      </motion.p>

      {showAction && onCreateEntry && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateEntry}
          className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200`}
        >
          <Plus className="w-5 h-5" />
          <span>{actionText}</span>
        </motion.button>
      )}

      {!isAuthenticated && type === 'public-entries' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-sm text-gray-500"
        >
          Connect your wallet to share your gratitude with the community
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;