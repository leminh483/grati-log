import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, MOOD_RATINGS } from '../utils/constants';
import { EntryInput, CategoryKey } from '../types';

interface CreateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  content: string;
  category: CategoryKey;
  mood_rating: number;
  is_public: boolean;
}

const CreateEntryModal: React.FC<CreateEntryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { actor } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      content: '',
      category: 'Other',
      mood_rating: 4,
      is_public: false,
    }
  });

  const selectedCategory = watch('category');
  const selectedMood = watch('mood_rating');

  const onSubmit = async (data: FormData) => {
    if (!actor) return;

    setLoading(true);
    setError(null);

    try {
      const entryInput: EntryInput = {
        title: data.title,
        content: data.content,
        category: { [data.category]: null } as any,
        mood_rating: BigInt(data.mood_rating),
        is_public: data.is_public,
      };

      const result = await actor.createEntry(entryInput);
      
      if ('ok' in result) {
        reset();
        onSuccess();
        onClose();
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('Failed to create entry. Please try again.');
      console.error('Error creating entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (key: CategoryKey) => {
    return CATEGORIES.find(cat => cat.key === key) || CATEGORIES[7];
  };

  const getMoodInfo = (rating: number) => {
    return MOOD_RATINGS.find(mood => mood.value === rating) || MOOD_RATINGS[2];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">New Gratitude Entry</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="What are you grateful for today?"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  {...register('content', { required: 'Content is required' })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Share your gratitude story..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category.key} value={category.key}>
                        {category.emoji} {category.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryInfo(selectedCategory).color}`}>
                      {getCategoryInfo(selectedCategory).emoji} {getCategoryInfo(selectedCategory).label}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mood Rating
                  </label>
                  <select
                    {...register('mood_rating', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {MOOD_RATINGS.map(mood => (
                      <option key={mood.value} value={mood.value}>
                        {mood.emoji} {mood.label}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMoodInfo(selectedMood).color}`}>
                      {getMoodInfo(selectedMood).emoji} {getMoodInfo(selectedMood).label}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    {...register('is_public')}
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Share with the community (others can appreciate your gratitude)
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Creating...' : 'Create Entry'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateEntryModal;