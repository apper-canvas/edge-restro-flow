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
    tableNumber: 'All',
    customerName: '',
    dateRange: 'All',
    customDateFrom: '',
    customDateTo: '',
    amountFrom: '',
    amountTo: ''
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

      // Customer name filter
      if (filters.customerName && !order.customerName.toLowerCase().includes(filters.customerName.toLowerCase())) {
        return false
      }

      // Amount range filter
      if (filters.amountFrom && order.totalAmount < parseFloat(filters.amountFrom)) {
        return false
      }
      if (filters.amountTo && order.totalAmount > parseFloat(filters.amountTo)) {
        return false
      }

      // Date range filter
      if (filters.dateRange !== 'All') {
        const orderDate = new Date(order.timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)

        switch (filters.dateRange) {
          case 'Today':
            if (orderDate.toDateString() !== today.toDateString()) return false
            break
          case 'Yesterday':
            if (orderDate.toDateString() !== yesterday.toDateString()) return false
            break
          case 'This Week':
            if (orderDate < weekAgo) return false
            break
          case 'This Month':
            if (orderDate < monthAgo) return false
            break
          case 'Custom':
            if (filters.customDateFrom) {
              const fromDate = new Date(filters.customDateFrom)
              if (orderDate < fromDate) return false
            }
            if (filters.customDateTo) {
              const toDate = new Date(filters.customDateTo)
              toDate.setHours(23, 59, 59, 999) // End of day
              if (orderDate > toDate) return false
            }
            break
        }
      }

      return true
    })
  }

  const clearAllFilters = () => {
    setFilters({
      status: 'All',
      tableNumber: 'All',
      customerName: '',
      dateRange: 'All',
      customDateFrom: '',
      customDateTo: '',
      amountFrom: '',
      amountTo: ''
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

            {/* Order Filters */}
            <div className="card-elegant">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100 flex items-center">
                  <ApperIcon name="Filter" className="w-5 h-5 mr-2 text-primary" />
                  Filter Orders
                </h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary transition-colors flex items-center space-x-1"
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="filter-grid gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm"
                  >
                    <option value="All">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="served">Served</option>
                  </select>
                </div>

                {/* Table Number Filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Table
                  </label>
                  <select
                    value={filters.tableNumber}
                    onChange={(e) => handleFilterChange('tableNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm"
                  >
                    <option value="All">All Tables</option>
                    {uniqueTableNumbers.map(tableNum => (
                      <option key={tableNum} value={tableNum.toString()}>Table {tableNum}</option>
                    ))}
                  </select>
                </div>

                {/* Customer Name Filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={filters.customerName}
                    onChange={(e) => handleFilterChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-500 text-sm"
                  />
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm"
                  >
                    <option value="All">All Time</option>
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="Custom">Custom Range</option>
                  </select>
                </div>

                {/* Custom Date Range */}
                {filters.dateRange === 'Custom' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={filters.customDateFrom}
                        onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={filters.customDateTo}
                        onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 text-sm"
                      />
                    </div>
                  </>
                )}

                {/* Amount Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Min Amount ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={filters.amountFrom}
                    onChange={(e) => handleFilterChange('amountFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Max Amount ($)
                  </label>
                  <input
                    type="number"
                    placeholder="999.99"
                    step="0.01"
                    min="0"
                    value={filters.amountTo}
                    onChange={(e) => handleFilterChange('amountTo', e.target.value)}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder-surface-500 text-sm"
                  />
                </div>
              </div>

              {/* Filter Results Summary */}
              <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-600">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-600 dark:text-surface-400">
                    Showing {filteredOrders.length} of {orders.length} orders
                  </span>
                  {filteredOrders.length !== orders.length && (
                    <span className="text-primary font-medium">
                      {orders.length - filteredOrders.length} orders filtered out
                    </span>
                  )}
                </div>
              </div>
            </div>



            {/* Orders List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {orders.map((order) => (
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

                    <div className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-2">
                    </div>
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