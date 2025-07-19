import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Heart, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserStats } from '../types';
import { CATEGORIES, MOOD_RATINGS } from '../utils/constants';

const StatsView: React.FC = () => {
  const { actor } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [actor]);

  const fetchStats = async () => {
    if (!actor) return;
    
    setLoading(true);
    try {
      const result = await actor.getMyStats();
      if ('ok' in result) {
        setStats(result.ok);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No stats available</p>
      </div>
    );
  }

  const categoryData = stats.entries_by_category
    .map(([category, count]) => {
      const categoryKey = Object.keys(category)[0] as any;
      const categoryInfo = CATEGORIES.find(c => c.key === categoryKey);
      return {
        name: categoryInfo?.label || 'Unknown',
        value: Number(count),
        color: categoryInfo?.color || 'bg-gray-100',
        emoji: categoryInfo?.emoji || '📝'
      };
    })
    .filter(item => item.value > 0);

  const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#6366F1', '#6B7280'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Entries</p>
              <p className="text-2xl font-bold">{Number(stats.total_entries)}</p>
            </div>
            <Target className="h-8 w-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Current Streak</p>
              <p className="text-2xl font-bold">{Number(stats.current_streak)} days</p>
            </div>
            <TrendingUp className="h-8 w-8 text-pink-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Longest Streak</p>
              <p className="text-2xl font-bold">{Number(stats.longest_streak)} days</p>
            </div>
            <Calendar className="h-8 w-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Average Mood</p>
              <p className="text-2xl font-bold">{stats.average_mood.toFixed(1)}/5</p>
            </div>
            <Heart className="h-8 w-8 text-blue-200" />
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Entries by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Mood Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-2xl mb-2">😊</div>
            <p className="text-sm text-gray-600">Average Mood</p>
            <p className="text-xl font-bold text-green-600">{stats.average_mood.toFixed(1)}/5</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <p className="text-sm text-gray-600">Mood Trend</p>
            <p className="text-xl font-bold text-purple-600">
              {stats.average_mood >= 4 ? 'Excellent' : 
               stats.average_mood >= 3 ? 'Good' : 
               stats.average_mood >= 2 ? 'Fair' : 'Needs Attention'}
            </p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm text-gray-600">Consistency</p>
            <p className="text-xl font-bold text-blue-600">
              {Number(stats.current_streak) >= 7 ? 'Great!' : 
               Number(stats.current_streak) >= 3 ? 'Good' : 'Getting Started'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsView;