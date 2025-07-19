import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, User, Clock, MessageCircle } from 'lucide-react';
import { GratitudeEntry } from '../types';
import { getCategoryInfo, getMoodInfo, getRelativeTime, truncateText } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';

interface EntryCardProps {
  entry: GratitudeEntry;
  onAppreciate?: (entryId: bigint) => void;
  onDelete?: (entryId: bigint) => void;
  isOwner?: boolean;
  showAppreciateButton?: boolean;
}

const EntryCard: React.FC<EntryCardProps> = ({ 
  entry, 
  onAppreciate, 
  onDelete, 
  isOwner = false, 
  showAppreciateButton = false 
}) => {
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const categoryKey = Object.keys(entry.category)[0] as any;
  const categoryInfo = getCategoryInfo(categoryKey);
  const moodInfo = getMoodInfo(Number(entry.mood_rating));

  const handleAppreciate = async () => {
    if (!onAppreciate || loading) return;
    
    setLoading(true);
    try {
      await onAppreciate(entry.id);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || loading) return;
    
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setLoading(true);
      try {
        await onDelete(entry.id);
      } finally {
        setLoading(false);
      }
    }
  };

  const shouldTruncate = entry.content.length > 200;
  const displayContent = !isExpanded && shouldTruncate 
    ? truncateText(entry.content, 200)
    : entry.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {entry.title}
            </h3>
            <div className="flex items-center space-x-3 mb-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                {categoryInfo.emoji} {categoryInfo.label}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${moodInfo.color}`}>
                {moodInfo.emoji} {moodInfo.label}
              </span>
            </div>
          </div>
          
          {isOwner && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              disabled={loading}
              className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-full hover:bg-red-50 transition-all duration-200"
            >
              <Trash2 className="h-5 w-5" />
            </motion.button>
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2 inline-flex items-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{isExpanded ? 'Show less' : 'Read more'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{entry.author.toString().slice(0, 8)}...</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{getRelativeTime(entry.created_at)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {entry.appreciations > 0 && (
              <div className="flex items-center space-x-1 text-pink-600">
                <Heart className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{Number(entry.appreciations)}</span>
              </div>
            )}
            
            {showAppreciateButton && isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAppreciate}
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Heart className="h-4 w-4" />
                <span>{loading ? 'Appreciating...' : 'Appreciate'}</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EntryCard;