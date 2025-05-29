import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const AddMenuItemModal = ({ isOpen, onClose, onAddMenuItem }) => {
  // Form state with comprehensive validation
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    imageUrl: '',
    initialStock: '10',
    minThreshold: '5',
    criticalThreshold: '2',
    unit: 'portions',
    supplier: '',
    costPerUnit: '',
    maxCapacity: '100',
    reorderLevel: '20',
    notes: ''
  })

  // Validation state
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviewError, setImagePreviewError] = useState(false)

  // Form validation rules
  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Menu item name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        if (value.trim().length > 50) return 'Name must be less than 50 characters'
        return ''
      
      case 'description':
        if (!value.trim()) return 'Description is required'
        if (value.trim().length < 10) return 'Description must be at least 10 characters'
        if (value.trim().length > 200) return 'Description must be less than 200 characters'
        return ''
      
      case 'price':
        if (!value) return 'Price is required'
        const price = parseFloat(value)
        if (isNaN(price) || price <= 0) return 'Price must be a positive number'
        if (price > 999.99) return 'Price must be less than $1000'
        return ''
      
      case 'imageUrl':
        if (value && !isValidUrl(value)) return 'Please enter a valid URL'
        return ''
      
      case 'initialStock':
        const stock = parseInt(value)
        if (isNaN(stock) || stock < 0) return 'Initial stock must be a non-negative number'
        if (stock > 9999) return 'Initial stock must be less than 10,000'
        return ''
      
      case 'minThreshold':
        const threshold = parseInt(value)
        if (isNaN(threshold) || threshold < 1) return 'Threshold must be at least 1'
        const maxThreshold = parseInt(formData.initialStock) || 0
        if (threshold > maxThreshold) return 'Threshold cannot exceed initial stock'
        return ''
      
      case 'criticalThreshold':
        const critical = parseInt(value)
        if (isNaN(critical) || critical < 0) return 'Critical threshold must be non-negative'
        const minThresh = parseInt(formData.minThreshold) || 0
        if (critical >= minThresh) return 'Critical threshold must be less than minimum threshold'
        return ''
      
      case 'costPerUnit':
        if (value && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
          return 'Cost per unit must be a non-negative number'
        }
        return ''
      
      case 'maxCapacity':
        const capacity = parseInt(value)
        if (isNaN(capacity) || capacity < 1) return 'Max capacity must be at least 1'
        const initialStock = parseInt(formData.initialStock) || 0
        if (capacity < initialStock) return 'Max capacity cannot be less than initial stock'
        return ''
      
      case 'reorderLevel':
        const reorder = parseInt(value)
        if (isNaN(reorder) || reorder < 0) return 'Reorder level must be non-negative'
        return ''
      
      default:
        return ''
    }
  }, [formData])

  // Helper function to validate URLs
  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        imageUrl: '',
        initialStock: '10',
        minThreshold: '5',
        criticalThreshold: '2',
        unit: 'portions',
        supplier: '',
        costPerUnit: '',
        maxCapacity: '100',
        reorderLevel: '20',
        notes: ''
      })
      setErrors({})
      setIsSubmitting(false)
      setImagePreviewError(false)
    }
  }, [isOpen])

  // Handle form field changes with validation
  const handleFieldChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Real-time validation
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
    
    // Clear image preview error when URL changes
    if (field === 'imageUrl') {
      setImagePreviewError(false)
    }
  }, [validateField])

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {}
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, validateField])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!validateForm()) {
        toast.error('Please fix all validation errors before submitting')
        setIsSubmitting(false)
        return
      }

      // Prepare menu item data
      const menuItemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
        initialStock: parseInt(formData.initialStock) || 10,
        minThreshold: parseInt(formData.minThreshold) || 5,
        criticalThreshold: parseInt(formData.criticalThreshold) || 2,
        unit: formData.unit || 'portions',
        supplier: formData.supplier.trim() || 'Default Supplier',
        costPerUnit: parseFloat(formData.costPerUnit) || 0,
        maxCapacity: parseInt(formData.maxCapacity) || 100,
        reorderLevel: parseInt(formData.reorderLevel) || 20,
        notes: formData.notes.trim()
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      onAddMenuItem(menuItemData)
      toast.success(
        <div className="flex items-center space-x-2">
          <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-medium">Menu item added successfully!</div>
            <div className="text-sm">{menuItemData.name} is now available</div>
          </div>
        </div>
      )
      onClose()
    } catch (error) {
      toast.error('Failed to add menu item. Please try again.')
      console.error('Error adding menu item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle modal close with confirmation if form has changes
  const handleClose = useCallback(() => {
    const hasChanges = Object.values(formData).some((value, index) => {
      const defaultValues = ['', '', '', 'Main Course', '', '10', '5', '2', 'portions', '', '', '100', '20', '']
      return value !== defaultValues[index]
    })

    if (hasChanges && !isSubmitting) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose()
      }
    } else {
      onClose()
    }
  }, [formData, isSubmitting, onClose])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, isSubmitting, handleClose])

  if (!isOpen) return null

  const categoryOptions = [
    { value: 'Appetizer', label: '🥗 Appetizer', description: 'Starters and small plates' },
    { value: 'Main Course', label: '🍽️ Main Course', description: 'Primary dishes' },
    { value: 'Dessert', label: '🍰 Dessert', description: 'Sweet treats' },
    { value: 'Beverage', label: '🥤 Beverage', description: 'Drinks and refreshments' },
    { value: 'Side Dish', label: '🍟 Side Dish', description: 'Accompaniments' },
    { value: 'Salad', label: '🥙 Salad', description: 'Fresh greens and vegetables' }
  ]

  const unitOptions = [
    { value: 'portions', label: 'Portions', icon: 'Users' },
    { value: 'pieces', label: 'Pieces', icon: 'Hash' },
    { value: 'kg', label: 'Kilograms', icon: 'Weight' },
    { value: 'liters', label: 'Liters', icon: 'Droplets' },
    { value: 'bottles', label: 'Bottles', icon: 'Bottle' },
    { value: 'packages', label: 'Packages', icon: 'Package' },
    { value: 'servings', label: 'Servings', icon: 'Utensils' }
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="modal-content max-w-4xl max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Modal Header */}
          <div className="modal-header bg-gradient-to-r from-primary to-primary-dark text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ApperIcon name="Plus" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Add New Menu Item</h2>
                <p className="text-white/80 text-sm">Create a delicious addition to your menu</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <ApperIcon name="X" className="w-5 h-5 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Enhanced Modal Body */}
            <div className="modal-body space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-surface-200 dark:border-surface-700">
                  <ApperIcon name="Info" className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Basic Information</h3>
                </div>

                {/* Menu Item Name */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className={`input-modern ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter menu item name (e.g., Margherita Pizza)"
                    required
                    maxLength={50}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                    {formData.name.length}/50 characters
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    className={`input-modern ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                    rows={3}
                    placeholder="Describe your dish (ingredients, cooking method, flavors...)"
                    required
                    maxLength={200}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
                      {errors.description}
                    </p>
                  )}
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                    {formData.description.length}/200 characters
                  </p>
                </div>

                {/* Price and Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Price * ($)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ApperIcon name="DollarSign" className="w-4 h-4 text-surface-400" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="999.99"
                        value={formData.price}
                        onChange={(e) => handleFieldChange('price', e.target.value)}
                        className={`input-modern pl-10 ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      className="input-modern"
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                      {categoryOptions.find(opt => opt.value === formData.category)?.description}
                    </p>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Image URL (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ApperIcon name="Image" className="w-4 h-4 text-surface-400" />
                    </div>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                      className={`input-modern pl-10 ${errors.imageUrl ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {errors.imageUrl && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
                      {errors.imageUrl}
                    </p>
                  )}
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                    Leave empty to use a default image. High-quality images work best.
                  </p>
                </div>
              </div>

              {/* Inventory & Alert Configuration Section */}
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-700">
                <div className="flex items-center space-x-2 pb-4 border-b border-amber-200 dark:border-amber-600 mb-6">
                  <ApperIcon name="Package" className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">Inventory & Alert Configuration</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Stock Configuration */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Initial Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="9999"
                      value={formData.initialStock}
                      onChange={(e) => handleFieldChange('initialStock', e.target.value)}
                      className={`input-modern ${errors.initialStock ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="10"
                      required
                    />
                    {errors.initialStock && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
                        {errors.initialStock}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Low Stock Alert *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.minThreshold}
                      onChange={(e) => handleFieldChange('minThreshold', e.target.value)}
                      className={`input-modern ${errors.minThreshold ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="5"
                      required
                    />
                    {errors.minThreshold && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
                        {errors.minThreshold}
                      </p>
                    )}
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Alert when stock falls below this number
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Critical Alert *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.criticalThreshold}
                      onChange={(e) => handleFieldChange('criticalThreshold', e.target.value)}
                      className={`input-modern ${errors.criticalThreshold ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="2"
                      required
                    />
                    {errors.criticalThreshold && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
                        {errors.criticalThreshold}
                      </p>
                    )}
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Urgent alert threshold
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Unit Type
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => handleFieldChange('unit', e.target.value)}
                      className="input-modern"
                    >
                      {unitOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Cost Per Unit ($)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ApperIcon name="DollarSign" className="w-4 h-4 text-surface-400" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.costPerUnit}
                        onChange={(e) => handleFieldChange('costPerUnit', e.target.value)}
                        className={`input-modern pl-10 ${errors.costPerUnit ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.costPerUnit && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
                        {errors.costPerUnit}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxCapacity}
                      onChange={(e) => handleFieldChange('maxCapacity', e.target.value)}
                      className={`input-modern ${errors.maxCapacity ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="100"
                    />
                    {errors.maxCapacity && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
                        {errors.maxCapacity}
                      </p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Supplier (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ApperIcon name="Truck" className="w-4 h-4 text-surface-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.supplier}
                        onChange={(e) => handleFieldChange('supplier', e.target.value)}
                        className="input-modern pl-10"
                        placeholder="Enter supplier name or company"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleFieldChange('notes', e.target.value)}
                      className="input-modern"
                      rows={2}
                      placeholder="Any special handling instructions, dietary information, etc."
                      maxLength={300}
                    />
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                      {formData.notes.length}/300 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Preview Section */}
              {(formData.name || formData.description || formData.price) && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-surface-200 dark:border-surface-700">
                    <ApperIcon name="Eye" className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Live Preview</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-surface-50 to-blue-50 dark:from-surface-700 dark:to-surface-600 rounded-xl p-6 border border-surface-200 dark:border-surface-600">
                    <div className="flex items-start space-x-6">
                      <div className="w-24 h-24 bg-surface-200 dark:bg-surface-600 rounded-xl overflow-hidden flex-shrink-0 border-2 border-surface-300 dark:border-surface-500">
                        {formData.imageUrl && !imagePreviewError ? (
                          <img
                            src={formData.imageUrl}
                            alt={formData.name || 'Preview'}
                            className="w-full h-full object-cover"
                            onError={() => setImagePreviewError(true)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ApperIcon name="Image" className="w-8 h-8 text-surface-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                            {formData.name || 'Item Name'}
                          </h4>
                          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                            {formData.description || 'Item description will appear here...'}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-primary">
                              ${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                            </span>
                            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">
                              {formData.category}
                            </span>
                          </div>
                          
                          <div className="text-right text-sm text-surface-600 dark:text-surface-400">
                            <div>Stock: {formData.initialStock || '0'} {formData.unit}</div>
                            <div>Alert at: {formData.minThreshold || '0'} {formData.unit}</div>
                          </div>
                        </div>
                        
                        {formData.supplier && (
                          <div className="flex items-center space-x-2 text-sm text-surface-500">
                            <ApperIcon name="Truck" className="w-4 h-4" />
                            <span>Supplied by: {formData.supplier}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Modal Footer */}
            <div className="modal-footer bg-surface-50 dark:bg-surface-800/50">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <ApperIcon name="X" className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || Object.values(errors).some(error => error)}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>Add Menu Item</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AddMenuItemModal