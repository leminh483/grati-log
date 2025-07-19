import { CategoryInfo, MoodRating } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  { key: 'Family', label: 'Family', emoji: '👨‍👩‍👧‍👦', color: 'bg-pink-100 text-pink-800' },
  { key: 'Health', label: 'Health', emoji: '💚', color: 'bg-green-100 text-green-800' },
  { key: 'Work', label: 'Work', emoji: '💼', color: 'bg-blue-100 text-blue-800' },
  { key: 'Friends', label: 'Friends', emoji: '👥', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'Nature', label: 'Nature', emoji: '🌿', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'Achievement', label: 'Achievement', emoji: '🏆', color: 'bg-purple-100 text-purple-800' },
  { key: 'Experience', label: 'Experience', emoji: '✨', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'Other', label: 'Other', emoji: '💫', color: 'bg-gray-100 text-gray-800' },
];

export const MOOD_RATINGS: MoodRating[] = [
  { value: 1, label: 'Very Low', emoji: '😢', color: 'bg-red-100 text-red-800' },
  { value: 2, label: 'Low', emoji: '😕', color: 'bg-orange-100 text-orange-800' },
  { value: 3, label: 'Neutral', emoji: '😐', color: 'bg-yellow-100 text-yellow-800' },
  { value: 4, label: 'Good', emoji: '😊', color: 'bg-green-100 text-green-800' },
  { value: 5, label: 'Excellent', emoji: '😄', color: 'bg-emerald-100 text-emerald-800' },
];

export const getCategoryInfo = (categoryKey: string): CategoryInfo => {
  return CATEGORIES.find(cat => cat.key === categoryKey) || CATEGORIES[7]; // Default to 'Other'
};

export const getMoodInfo = (rating: number): MoodRating => {
  return MOOD_RATINGS.find(mood => mood.value === rating) || MOOD_RATINGS[2]; // Default to 'Neutral'
};

export const formatDate = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRelativeTime = (timestamp: bigint): string => {
  const now = Date.now();
  const entryTime = Number(timestamp) / 1_000_000;
  const diffInMs = now - entryTime;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} days ago`;
  } else {
    return formatDate(timestamp);
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};