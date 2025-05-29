import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-blue-50 to-amber-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
        >
          <ApperIcon name="ChefHat" className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl font-bold text-gradient mb-4"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl font-semibold text-surface-800 dark:text-surface-200 mb-4"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist. Let's get you back to managing your restaurant.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 btn-primary"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound