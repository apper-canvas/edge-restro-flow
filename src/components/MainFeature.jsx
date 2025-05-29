import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import AddOrderModal from './AddOrderModal'
import AddMenuItemModal from './AddMenuItemModal'



const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([
    {
      id: '001',
      tableNumber: 5,
      items: ['Margherita Pizza', 'Caesar Salad', 'Coke'],
      status: 'pending',
      totalAmount: 32.50,
      timestamp: new Date(),
      customerName: 'John Doe'
    },
    {
      id: '002',
      tableNumber: 3,
      items: ['Grilled Salmon', 'Garlic Bread'],
      status: 'preparing',
      totalAmount: 28.00,
      timestamp: new Date(Date.now() - 300000),
      customerName: 'Jane Smith'
    },
    {
      id: '003',
      tableNumber: 7,
      items: ['Beef Steak', 'Mashed Potatoes', 'Wine'],
      status: 'ready',
      totalAmount: 45.75,
      timestamp: new Date(Date.now() - 900000),
      customerName: 'Mike Johnson'
    }
  ])

  const [tables, setTables] = useState([
    { id: 1, number: 1, capacity: 2, status: 'available' },
    { id: 2, number: 2, capacity: 4, status: 'occupied' },
    { id: 3, number: 3, capacity: 4, status: 'occupied' },
    { id: 4, number: 4, capacity: 6, status: 'reserved' },
    { id: 5, number: 5, capacity: 4, status: 'occupied' },
    { id: 6, number: 6, capacity: 2, status: 'available' },
    { id: 7, number: 7, capacity: 4, status: 'occupied' },
    { id: 8, number: 8, capacity: 8, status: 'available' },
  ])

  const [menuItems, setMenuItems] = useState([
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Fresh tomatoes, mozzarella, and basil',
      price: 16.99,
      category: 'Main Course',
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with parmesan and croutons',
      price: 12.50,
      category: 'Appetizer',
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with herbs',
      price: 24.99,
      category: 'Main Course',
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop'
    }
  ])

  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false)
  // Filter states
  const [filters, setFilters] = useState({
    status: 'All',
    tableNumber: 'All'
  })



  const [isAddMenuItemModalOpen, setIsAddMenuItemModalOpen] = useState(false)




  const tabs = [
    { id: 'orders', label: 'Orders', icon: 'ClipboardList' },
    { id: 'tables', label: 'Tables', icon: 'Grid3X3' },
    { id: 'menu', label: 'Menu', icon: 'MenuSquare' }
  ]

  const statusColors = {
    pending: 'status-pending',
    preparing: 'status-preparing',
    ready: 'status-ready',
    served: 'status-served'
  }

  const tableStatusColors = {
    available: 'table-available',
    occupied: 'table-occupied',
    reserved: 'table-reserved'
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    toast.success(`Order #${orderId} status updated to ${newStatus}`)
  }

  const updateTableStatus = (tableId, newStatus) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status: newStatus } : table
    ))
    toast.success(`Table ${tableId} status updated to ${newStatus}`)
  }

  const addOrder = (orderData) => {
    const order = {
      id: String(orders.length + 1).padStart(3, '0'),
      tableNumber: orderData.tableNumber,
      items: orderData.items.map(item => `${item.name} x${item.quantity}`),
      status: 'pending',
      totalAmount: orderData.totalAmount,
      timestamp: new Date(),
      customerName: orderData.customerName,
      notes: orderData.notes
    }

    setOrders([...orders, order])
    
    // Update table status to occupied
    setTables(tables.map(table => 
      table.number === orderData.tableNumber 
        ? { ...table, status: 'occupied' } 
        : table
    ))
    
    toast.success('New order added successfully!')
  }


  const addMenuItem = (menuItemData) => {
    const menuItem = {
      id: String(menuItems.length + 1),
      name: menuItemData.name,
      description: menuItemData.description,
      price: menuItemData.price,
      category: menuItemData.category,
      available: true,
      imageUrl: menuItemData.imageUrl
    }

    setMenuItems([...menuItems, menuItem])
    toast.success('Menu item added successfully!')
  }



  const toggleMenuItemAvailability = (itemId) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ))
    const item = menuItems.find(item => item.id === itemId)
    toast.success(`${item.name} ${item.available ? 'disabled' : 'enabled'}`)
  }

  // Filter functions
  // Filter functions
  const filterOrders = () => {
    return orders.filter(order => {
      // Status filter
      if (filters.status !== 'All' && order.status !== filters.status) {
        return false
      }

      // Table number filter
      if (filters.tableNumber !== 'All' && order.tableNumber.toString() !== filters.tableNumber) {
        return false
      }

      return true
    })
  }


  const clearAllFilters = () => {
    setFilters({
      status: 'All',
      tableNumber: 'All'
    })
    toast.success('All filters cleared')
  }


  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  // Get filtered orders
  const filteredOrders = filterOrders()

  // Get unique table numbers for filter dropdown
  const uniqueTableNumbers = [...new Set(orders.map(order => order.tableNumber))].sort((a, b) => a - b)


  return (
    <div className="w-full">
      {/* Header Stats */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8"
      >
        <div className="card-elegant text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="ClipboardList" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">{orders.length}</p>
          <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">Active Orders</p>
        </div>

        <div className="card-elegant text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Grid3X3" className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">{tables.filter(t => t.status === 'occupied').length}</p>
          <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">Tables Occupied</p>
        </div>

        <div className="card-elegant text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="MenuSquare" className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">{menuItems.filter(m => m.available).length}</p>
          <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">Menu Items</p>
        </div>

        <div className="card-elegant text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="DollarSign" className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-surface-100">
            ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(0)}
          </p>
          <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400">Today's Revenue</p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex space-x-1 p-1 bg-white dark:bg-surface-800 rounded-2xl shadow-soft border border-surface-200 dark:border-surface-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-50 dark:hover:bg-surface-700'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Add New Order Button */}
            <div className="card-elegant">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100 flex items-center">
                    <ApperIcon name="Plus" className="w-5 h-5 mr-2 text-primary" />
                    Add New Order
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                    Create a new order with menu item selection
                  </p>
                </div>
                <button
                  onClick={() => setIsAddOrderModalOpen(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span>Add Order</span>
                </button>
              </div>
            </div>

            {/* Enhanced Order Filters */}
            <div className="filter-card">
              {/* Filter Header */}
              <div className="filter-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Filter" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Smart Order Filters</h3>
                      <p className="text-white/80 text-sm">Find orders quickly with advanced filtering</p>
                    </div>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                  >
                    <ApperIcon name="RotateCcw" className="w-4 h-4" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              {/* Quick Status Filters */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-3 flex items-center">
                  <ApperIcon name="Zap" className="w-5 h-5 mr-2 text-amber-500" />
                  Quick Status Filters
                </h4>
                <div className="flex flex-wrap gap-3">
                  {['All', 'pending', 'preparing', 'ready', 'served'].map((status) => {
                    const isActive = filters.status === status
                    const statusLabels = {
                      'All': 'All Orders',
                      'pending': 'Pending',
                      'preparing': 'Preparing', 
                      'ready': 'Ready',
                      'served': 'Served'
                    }
                    
                    return (
                      <button
                        key={status}
                        onClick={() => handleFilterChange('status', status)}
                        className={`quick-filter-button ${
                          isActive ? 'quick-filter-active' : 'quick-filter-inactive'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {status !== 'All' && (
                            <div className={`w-3 h-3 rounded-full ${
                              status === 'pending' ? 'bg-amber-400' :
                              status === 'preparing' ? 'bg-blue-400' :
                              status === 'ready' ? 'bg-green-400' :
                              'bg-gray-400'
                            }`}></div>
                          )}
                          <span>{statusLabels[status]}</span>
                          {status !== 'All' && (
                            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                              {orders.filter(o => o.status === status).length}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Advanced Filter Controls */}
              <div className="filter-grid">
                {/* Status Filter */}
                <div className="filter-control">
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center">
                    <ApperIcon name="Settings" className="w-4 h-4 mr-2 text-primary" />
                    Order Status
                  </label>
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="filter-select"
                    >
                      <option value="All">🔄 All Status Types</option>
                      <option value="pending">⏳ Pending Orders</option>
                      <option value="preparing">👨‍🍳 Currently Preparing</option>
                      <option value="ready">✅ Ready to Serve</option>
                      <option value="served">📋 Completed Orders</option>
                    </select>
                    <ApperIcon name="ChevronDown" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" />
                  </div>
                </div>

                {/* Table Filter */}
                <div className="filter-control">
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center">
                    <ApperIcon name="Grid3X3" className="w-4 h-4 mr-2 text-primary" />
                    Table Selection
                  </label>
                  <div className="relative">
                    <select
                      value={filters.tableNumber}
                      onChange={(e) => handleFilterChange('tableNumber', e.target.value)}
                      className="filter-select"
                    >
                      <option value="All">🏠 All Tables</option>
                      {uniqueTableNumbers.map(tableNum => (
                        <option key={tableNum} value={tableNum.toString()}>🍽️ Table {tableNum}</option>
                      ))}
                    </select>
                    <ApperIcon name="ChevronDown" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active Filter Badges */}
              {(filters.status !== 'All' || filters.tableNumber !== 'All') && (
                <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-600">
                  <h5 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-3 flex items-center">
                    <ApperIcon name="Tag" className="w-4 h-4 mr-2" />
                    Active Filters
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {filters.status !== 'All' && (
                      <div className="filter-badge">
                        <span>Status: {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}</span>
                        <button
                          onClick={() => handleFilterChange('status', 'All')}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <ApperIcon name="X" className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {filters.tableNumber !== 'All' && (
                      <div className="filter-badge">
                        <span>Table: {filters.tableNumber}</span>
                        <button
                          onClick={() => handleFilterChange('tableNumber', 'All')}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                          <ApperIcon name="X" className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Filter Results Summary */}
              <div className="filter-results-card mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Search" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                        {filteredOrders.length} Orders Found
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Out of {orders.length} total orders
                      </p>
                    </div>
                  </div>
                  {filteredOrders.length !== orders.length && (
                    <div className="text-right">
                      <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium">
                        {orders.length - filteredOrders.length} filtered out
                      </div>
                    </div>
                  )}
                </div>
                
                {filteredOrders.length === 0 && orders.length > 0 && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
                      <ApperIcon name="AlertTriangle" className="w-5 h-5" />
                      <span className="font-medium">No orders match your current filters</span>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                      Try adjusting your filter criteria or clearing all filters to see more results.
                    </p>
                  </div>
                )}
              </div>
            </div>





            {/* Orders List */}
            {/* Orders List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredOrders.map((order) => (

                <motion.div
                  key={order.id}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="order-card card-elegant"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        Order #{order.id}
                      </h4>
                      <p className="text-sm text-surface-600 dark:text-surface-400">
                        Table {order.tableNumber} • {order.customerName}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-surface-900 dark:text-surface-100 mb-2">Items:</h5>
                    <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <ApperIcon name="Dot" className="w-3 h-3 mr-1" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-surface-900 dark:text-surface-100">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <span className="text-xs text-surface-500 dark:text-surface-400">
                      {order.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['pending', 'preparing', 'ready', 'served'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(order.id, status)}
                        disabled={order.status === status}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                          order.status === status
                            ? 'bg-surface-200 text-surface-600 cursor-not-allowed'
                            : 'bg-surface-100 hover:bg-surface-200 text-surface-700 hover:text-surface-900'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'tables' && (
          <motion.div
            key="tables"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card-elegant mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100 mb-4 flex items-center">
                <ApperIcon name="Grid3X3" className="w-5 h-5 mr-2 text-primary" />
                Restaurant Layout
              </h3>
              
              <div className="table-grid">
                {tables.map((table) => (
                  <motion.div
                    key={table.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`aspect-square rounded-xl border-2 p-3 sm:p-4 cursor-pointer transition-all duration-300 ${tableStatusColors[table.status]}`}
                  >
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <ApperIcon name="Table" className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                      <div className="text-lg sm:text-xl font-bold">{table.number}</div>
                      <div className="text-xs sm:text-sm opacity-75">{table.capacity} seats</div>
                      <div className="text-xs font-medium mt-1 capitalize">{table.status}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-amber-200 border border-amber-300 rounded"></div>
                  <span className="text-sm text-surface-600 dark:text-surface-400">Reserved</span>
                </div>
              </div>
            </div>

            {/* Table Status Controls */}
            <div className="card-elegant">
              <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Quick Status Update</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {tables.map((table) => (
                  <div key={table.id} className="p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                      <span>Table {table.number}</span>

                    <select
                      value={table.status}
                      onChange={(e) => updateTableStatus(table.id, e.target.value)}
                      className="w-full text-xs px-2 py-1 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === 'menu' && (
          <motion.div
            key="menu"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Add New Menu Item */}
            <div className="card-elegant">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100 flex items-center">
                    <ApperIcon name="Plus" className="w-5 h-5 mr-2 text-primary" />
                    Add Menu Item
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                    Create a new menu item for your restaurant
                  </p>
                </div>
                <button
                  onClick={() => setIsAddMenuItemModalOpen(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>



            {/* Menu Items Grid */}
            <div className="menu-grid">
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`card-elegant overflow-hidden ${!item.available ? 'opacity-60' : ''}`}

                >
                  <div className="aspect-video bg-surface-100 dark:bg-surface-700 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-surface-900 dark:text-surface-100">{item.name}</h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">{item.description}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-surface-100 dark:bg-surface-700 rounded-full text-surface-600 dark:text-surface-400">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                      <button
                        onClick={() => toggleMenuItemAvailability(item.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                          item.available
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Order Modal */}
      <AddOrderModal
        isOpen={isAddOrderModalOpen}
        onClose={() => setIsAddOrderModalOpen(false)}
        onAddOrder={addOrder}
        menuItems={menuItems}
        tables={tables}
      />

      {/* Add Menu Item Modal */}
      <AddMenuItemModal
        isOpen={isAddMenuItemModalOpen}
        onClose={() => setIsAddMenuItemModalOpen(false)}
        onAddMenuItem={addMenuItem}
      />
    </div>
  )
}

export default MainFeature