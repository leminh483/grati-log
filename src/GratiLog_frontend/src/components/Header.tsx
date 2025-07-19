import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Heart, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, login, logout, principal, loading } = useAuth();

  const truncatedPrincipal = principal 
    ? `${principal.slice(0, 5)}...${principal.slice(-5)}`
    : '';

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Heart className="h-8 w-8 text-pink-300" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
              GratiLog
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-3 py-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{truncatedPrincipal}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-4 py-2 transition-all duration-200 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={login}
                disabled={loading}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-6 py-2 font-medium transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;