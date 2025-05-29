import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const AddMenuItemModal = ({ isOpen, onClose, onAddMenuItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    imageUrl: '',
    initialStock: '10',
    minThreshold: '5',
    unit: 'portions',
    supplier: '',
    costPerUnit: ''
  })

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
        unit: 'portions',
        supplier: '',
        costPerUnit: ''
      })
    }

  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter menu item name')
      return
    }
    if (!formData.description.trim()) {
      toast.error('Please enter menu item description')
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    // Prepare menu item data
    // Prepare menu item data
    const menuItemData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
      initialStock: parseInt(formData.initialStock) || 10,
      minThreshold: parseInt(formData.minThreshold) || 5,
      unit: formData.unit || 'portions',
      supplier: formData.supplier.trim() || 'Default Supplier',
      costPerUnit: parseFloat(formData.costPerUnit) || 0
    }

    onAddMenuItem(menuItemData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="modal-content max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="modal-header">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 flex items-center">
              <ApperIcon name="Plus" className="w-5 h-5 mr-2 text-primary" />
              Add Menu Item
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Modal Body */}
            <div className="modal-body space-y-6">
              {/* Menu Item Name */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-modern"
                  placeholder="Enter menu item name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input-modern"
                  rows={3}
                  placeholder="Enter item description"
                  required
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="input-modern"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="input-modern"
                  >
                    <option value="Appetizer">Appetizer</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="input-modern"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                  Leave empty to use a default image
                </p>

              </div>

              {/* Inventory Configuration */}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-4 flex items-center">
                  <ApperIcon name="Package" className="w-4 h-4 mr-2" />
                  Inventory & Alert Configuration
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Initial Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.initialStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, initialStock: e.target.value }))}
                      className="input-modern"
                      placeholder="10"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Alert Threshold *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.minThreshold}
                      onChange={(e) => setFormData(prev => ({ ...prev, minThreshold: e.target.value }))}
                      className="input-modern"
                      placeholder="5"
                      required
                    />
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Alert when stock falls below this number
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Unit Type
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      className="input-modern"
                    >
                      <option value="portions">Portions</option>
                      <option value="pieces">Pieces</option>
                      <option value="kg">Kilograms</option>
                      <option value="liters">Liters</option>
                      <option value="bottles">Bottles</option>
                      <option value="packages">Packages</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Cost Per Unit
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.costPerUnit}
                      onChange={(e) => setFormData(prev => ({ ...prev, costPerUnit: e.target.value }))}
                      className="input-modern"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Supplier (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                      className="input-modern"
                      placeholder="Enter supplier name"
                    />
                  </div>
                </div>
              </div>

              </div>

              {/* Preview */}
              {(formData.name || formData.description || formData.price) && (
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Preview
                  </label>
                  <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-surface-200 dark:bg-surface-600 rounded-lg overflow-hidden flex-shrink-0">
                        {formData.imageUrl ? (
                          <img
                            src={formData.imageUrl}
                            alt={formData.name || 'Preview'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ApperIcon name="Image" className="w-6 h-6 text-surface-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-surface-900 dark:text-surface-100">
                          {formData.name || 'Item Name'}
                        </h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                          {formData.description || 'Item description'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-primary">
                            ${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                          </span>
                          <span className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-600 rounded">
                            {formData.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span>Add Menu Item</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AddMenuItemModal