import React from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 glass-effect border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto responsive-padding">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="ChefHat" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gradient">RestroFlow</h1>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
              >
                <ApperIcon 
                  name={darkMode ? 'Sun' : 'Moon'} 
                  className="w-5 h-5 text-surface-700 dark:text-surface-300" 
                />
              </button>
              
              <div className="hidden sm:flex items-center space-x-2 bg-white/30 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Live Dashboard
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto responsive-padding py-6 sm:py-8 lg:py-12">
        <MainFeature />
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="border-t border-surface-200 dark:border-surface-700 mt-16 sm:mt-20"
      >
        <div className="max-w-7xl mx-auto responsive-padding py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <ApperIcon name="ChefHat" className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gradient">RestroFlow</h3>
              </div>
              <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">
                Streamline your restaurant operations with our comprehensive management platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                <li>Order Management</li>
                <li>Table Reservations</li>
                <li>Menu Control</li>
                <li>Real-time Updates</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">Operations</h4>
              <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                <li>Kitchen Dashboard</li>
                <li>Staff Management</li>
                <li>Inventory Tracking</li>
                <li>Analytics</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                <li>24/7 Help Center</li>
                <li>Training Resources</li>
                <li>System Updates</li>
                <li>Technical Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-surface-200 dark:border-surface-700 mt-8 pt-8 text-center">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              © 2024 RestroFlow. Built for restaurant excellence.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home