import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const AddOrderModal = ({ isOpen, onClose, onAddOrder, menuItems, tables }) => {
  const [formData, setFormData] = useState({
    tableNumber: '',
    customerName: '',
    selectedItems: [],
    notes: ''
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [itemQuantities, setItemQuantities] = useState({})

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        tableNumber: '',
        customerName: '',
        selectedItems: [],
        notes: ''
      })
      setSearchTerm('')
      setSelectedCategory('All')
      setItemQuantities({})
    }
  }, [isOpen])

  // Get unique categories from menu items
  const categories = ['All', ...new Set(menuItems.map(item => item.category))]

  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const isAvailable = item.available
    return matchesSearch && matchesCategory && isAvailable
  })

  // Get available tables
  const availableTables = tables.filter(table => table.status === 'available')

  const handleItemSelect = (item) => {
    const isSelected = formData.selectedItems.some(selectedItem => selectedItem.id === item.id)
    
    if (isSelected) {
      // Remove item
      setFormData(prev => ({
        ...prev,
        selectedItems: prev.selectedItems.filter(selectedItem => selectedItem.id !== item.id)
      }))
      // Remove quantity
      const newQuantities = { ...itemQuantities }
      delete newQuantities[item.id]
      setItemQuantities(newQuantities)
    } else {
      // Add item
      setFormData(prev => ({
        ...prev,
        selectedItems: [...prev.selectedItems, item]
      }))
      // Set default quantity
      setItemQuantities(prev => ({ ...prev, [item.id]: 1 }))
    }
  }

  const handleQuantityChange = (itemId, quantity) => {
    const qty = parseInt(quantity) || 1
    setItemQuantities(prev => ({ ...prev, [itemId]: qty }))
  }

  const calculateTotal = () => {
    return formData.selectedItems.reduce((total, item) => {
      const quantity = itemQuantities[item.id] || 1
      return total + (item.price * quantity)
    }, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.tableNumber) {
      toast.error('Please select a table')
      return
    }
    if (!formData.customerName.trim()) {
      toast.error('Please enter customer name')
      return
    }
    if (formData.selectedItems.length === 0) {
      toast.error('Please select at least one menu item')
      return
    }

    // Prepare order data
    const orderData = {
      tableNumber: parseInt(formData.tableNumber),
      customerName: formData.customerName.trim(),
      items: formData.selectedItems.map(item => ({
        ...item,
        quantity: itemQuantities[item.id] || 1
      })),
      notes: formData.notes.trim(),
      totalAmount: calculateTotal()
    }

    onAddOrder(orderData)
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
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="modal-header">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 flex items-center">
              <ApperIcon name="Plus" className="w-5 h-5 mr-2 text-primary" />
              Add New Order
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
              {/* Customer and Table Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Table Number *
                  </label>
                  <select
                    value={formData.tableNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, tableNumber: e.target.value }))}
                    className="input-modern"
                    required
                  >
                    <option value="">Select a table</option>
                    {availableTables.map(table => (
                      <option key={table.id} value={table.number}>
                        Table {table.number} ({table.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    className="input-modern"
                    placeholder="Enter customer name"
                    required
                  />
                </div>
              </div>

              {/* Menu Item Selection */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Select Menu Items *
                </label>
                
                {/* Search and Filter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-modern"
                  />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-modern"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                  {filteredMenuItems.map(item => {
                    const isSelected = formData.selectedItems.some(selectedItem => selectedItem.id === item.id)
                    return (
                      <div
                        key={item.id}
                        className={`menu-item-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleItemSelect(item)}
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-surface-900 dark:text-surface-100 text-sm">
                              {item.name}
                            </h4>
                            <p className="text-xs text-surface-600 dark:text-surface-400 truncate">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm font-bold text-primary">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded">
                                {item.category}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <ApperIcon name="Check" className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {filteredMenuItems.length === 0 && (
                  <div className="text-center py-8 text-surface-500 dark:text-surface-400">
                    <ApperIcon name="Search" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No menu items found</p>
                  </div>
                )}
              </div>

              {/* Selected Items Summary */}
              {formData.selectedItems.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Selected Items ({formData.selectedItems.length})
                  </label>
                  <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4 space-y-3">
                    {formData.selectedItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div>
                            <span className="font-medium text-surface-900 dark:text-surface-100">
                              {item.name}
                            </span>
                            <div className="text-sm text-surface-600 dark:text-surface-400">
                              ${item.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-surface-700 dark:text-surface-300">
                            Qty:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={itemQuantities[item.id] || 1}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="quantity-input"
                          />
                          <button
                            type="button"
                            onClick={() => handleItemSelect(item)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t border-surface-200 dark:border-surface-600 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-surface-900 dark:text-surface-100">
                          Total Amount:
                        </span>
                        <span className="text-xl font-bold text-primary">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Notes */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-modern"
                  rows={3}
                  placeholder="Any special instructions or notes..."
                />
              </div>
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
                disabled={formData.selectedItems.length === 0}
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span>Add Order (${calculateTotal().toFixed(2)})</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AddOrderModal
