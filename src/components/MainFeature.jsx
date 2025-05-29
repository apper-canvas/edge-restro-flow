import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import AddOrderModal from './AddOrderModal'
import AddMenuItemModal from './AddMenuItemModal'
import Chart from 'react-apexcharts'



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
      imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=300&h=200&fit=crop',
      inventory: {
        currentStock: 25,
        minThreshold: 5,
        unit: 'portions',
        supplier: 'Local Ingredients Co.',
        lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        costPerUnit: 8.50
      }
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with parmesan and croutons',
      price: 12.50,
      category: 'Appetizer',
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
      inventory: {
        currentStock: 3,
        minThreshold: 8,
        unit: 'portions',
        supplier: 'Fresh Greens Supplier',
        lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        costPerUnit: 6.25
      }
    },
    {
      id: '3',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with herbs',
      price: 24.99,
      category: 'Main Course',
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
      inventory: {
        currentStock: 0,
        minThreshold: 4,
        unit: 'portions',
        supplier: 'Ocean Fresh Seafood',
        lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        costPerUnit: 15.75
      }
    }
  ])

  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false)
  // Filter states
  const [filters, setFilters] = useState({
    status: 'All',
    tableNumber: 'All'
  })



  const [isAddMenuItemModalOpen, setIsAddMenuItemModalOpen] = useState(false)
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [payments, setPayments] = useState([
    {
      id: 'PAY001',
      orderId: '001',
      amount: 32.50,
      paymentMethod: 'Cash',
      status: 'completed',
      timestamp: new Date(Date.now() - 3600000),
      notes: 'Exact change provided'
    },
    {
      id: 'PAY002',
      orderId: '002',
      amount: 28.00,
      paymentMethod: 'Card',
      status: 'completed',
      timestamp: new Date(Date.now() - 1800000),
      notes: 'Visa card payment'
    },
    {
      id: 'PAY003',
      orderId: '003',
      amount: 20.00,
      paymentMethod: 'Cash',
      status: 'partial',
      timestamp: new Date(Date.now() - 900000),
      notes: 'Partial payment received'
    }
  ])
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false)
  const [paymentFilters, setPaymentFilters] = useState({
    status: 'All',
    paymentMethod: 'All',
    orderId: 'All'
  })







  const tabs = [
    { id: 'orders', label: 'Orders', icon: 'ClipboardList' },
    { id: 'tables', label: 'Tables', icon: 'Grid3X3' },
    { id: 'menu', label: 'Menu', icon: 'MenuSquare' },
    { id: 'inventory', label: 'Inventory', icon: 'Package' },
    { id: 'payments', label: 'Payments', icon: 'CreditCard' }
  ]


  const statusColors = {
    pending: 'status-pending',
    preparing: 'status-preparing',
    ready: 'status-ready',
    served: 'status-served',
    completed: 'status-completed'
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

  // Enhanced alert system for low stock monitoring
  useEffect(() => {
    const checkInventoryAlerts = () => {
      const lowStockItems = menuItems.filter(item => 
        item.inventory.currentStock <= item.inventory.minThreshold && item.inventory.currentStock > 0
      )
      const outOfStockItems = menuItems.filter(item => item.inventory.currentStock === 0)
      const criticalItems = menuItems.filter(item => 
        item.inventory.currentStock <= Math.ceil(item.inventory.minThreshold * 0.5) && item.inventory.currentStock > 0
      )

      // Critical stock alerts (below 50% of threshold)
      if (criticalItems.length > 0) {
        criticalItems.forEach(item => {
          toast.error(
            <div className="flex items-center space-x-2">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-semibold">CRITICAL: {item.name}</div>
                <div className="text-sm">Only {item.inventory.currentStock} {item.inventory.unit} remaining!</div>
              </div>
            </div>,
            {
              toastId: `critical-stock-${item.id}`,
              autoClose: false,
              className: 'border-l-4 border-red-500'
            }
          )
        })
      }

      // Low stock warnings
      if (lowStockItems.length > 0) {
        lowStockItems.filter(item => !criticalItems.includes(item)).forEach(item => {
          toast.warning(
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <ApperIcon name="AlertTriangle" className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs">{item.inventory.currentStock} {item.inventory.unit} left</div>
                </div>
              </div>
              <button
                onClick={() => restockItem(item.id, item.inventory.minThreshold * 2)}
                className="px-2 py-1 bg-amber-600 text-white rounded text-xs font-medium hover:bg-amber-700 transition-colors"
              >
                Quick Restock
              </button>
            </div>,
            {
              toastId: `low-stock-${item.id}`,
              autoClose: 8000,
              className: 'border-l-4 border-amber-500'
            }
          )
        })
      }

      // Out of stock alerts
      if (outOfStockItems.length > 0) {
        outOfStockItems.forEach(item => {
          toast.error(
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <ApperIcon name="X" className="w-4 h-4 text-red-600" />
                <div>
                  <div className="font-semibold">OUT OF STOCK</div>
                  <div className="text-sm">{item.name}</div>
                </div>
              </div>
              <button
                onClick={() => restockItem(item.id, item.inventory.minThreshold * 3)}
                className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
              >
                Emergency Restock
              </button>
            </div>,
            {
              toastId: `out-of-stock-${item.id}`,
              autoClose: false,
              className: 'border-l-4 border-red-600'
            }
          )
        })
      }
    }

    // Check alerts immediately and then every 30 seconds
    checkInventoryAlerts()
    const alertInterval = setInterval(checkInventoryAlerts, 30000)

    return () => clearInterval(alertInterval)
  }, [menuItems])


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
    // Reduce inventory for ordered items
    orderData.items.forEach(orderItem => {
      setMenuItems(prevItems => 
        prevItems.map(menuItem => {
          if (menuItem.name === orderItem.name) {
            const newStock = Math.max(0, menuItem.inventory.currentStock - orderItem.quantity)
            return {
              ...menuItem,
              inventory: {
                ...menuItem.inventory,
                currentStock: newStock
              },
              available: newStock > 0
            }
          }
          return menuItem
        })
      )
    })
    

  }

  const editOrder = (order) => {
    setEditingOrder(order)
    setIsEditOrderModalOpen(true)
  }

  const updateOrder = (updatedOrderData) => {
    setOrders(orders.map(order => 
      order.id === editingOrder.id 
        ? { 
            ...order,
            customerName: updatedOrderData.customerName,
            tableNumber: updatedOrderData.tableNumber,
            items: updatedOrderData.items.map(item => `${item.name} x${item.quantity}`),
            totalAmount: updatedOrderData.totalAmount,
            notes: updatedOrderData.notes
          }
        : order
    ))
    
    // Update table status if table changed
    if (editingOrder.tableNumber !== updatedOrderData.tableNumber) {
      setTables(tables.map(table => {
        if (table.number === editingOrder.tableNumber) {
          return { ...table, status: 'available' }
        }
        if (table.number === updatedOrderData.tableNumber) {
          return { ...table, status: 'occupied' }
        }
        return table
      }))
    }
    
    toast.success(`Order #${editingOrder.id} updated successfully!`)
  }

  const deleteOrder = (orderId) => {
    const orderToDelete = orders.find(order => order.id === orderId)
    
    if (window.confirm(`Are you sure you want to delete Order #${orderId}?`)) {
      setOrders(orders.filter(order => order.id !== orderId))
      
      // Update table status to available
      setTables(tables.map(table => 
        table.number === orderToDelete.tableNumber 
          ? { ...table, status: 'available' } 
          : table
      ))
      
      toast.success(`Order #${orderId} deleted successfully!`)
    }
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

    const newMenuItem = {
      ...menuItem,
      inventory: {
        currentStock: menuItemData.initialStock || 10,
        minThreshold: menuItemData.minThreshold || 5,
        unit: menuItemData.unit || 'portions',
        supplier: menuItemData.supplier || 'Default Supplier',
        lastRestocked: new Date(),
        costPerUnit: menuItemData.costPerUnit || 0
      }
    }

    setMenuItems([...menuItems, newMenuItem])
    toast.success(
      <div className="flex items-center space-x-2">
        <ApperIcon name="Plus" className="w-4 h-4 text-green-600" />
        <div>
          <div className="font-medium">{menuItemData.name} added!</div>
          <div className="text-xs">Alert threshold: {menuItemData.minThreshold} {menuItemData.unit}</div>
        </div>
      </div>
    )
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

  // Inventory Management Functions
  const updateInventoryStock = (itemId, newStock, reason = 'Manual adjustment') => {
    setMenuItems(menuItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = {
          ...item,
          inventory: {
            ...item.inventory,
            currentStock: Math.max(0, newStock)
          },
          available: newStock > 0
        }
        
        // Log the inventory change
        console.log(`Inventory Update - ${item.name}: ${item.inventory.currentStock} -> ${newStock} (${reason})`)
        
        return updatedItem
      }
      return item
    }))
    
    toast.success(`Inventory updated successfully`)
  }

  const restockItem = (itemId, quantity) => {
    setMenuItems(menuItems.map(item => {
      if (item.id === itemId) {
        const newStock = item.inventory.currentStock + quantity
        return {
          ...item,
          inventory: {
            ...item.inventory,
            currentStock: newStock,
            lastRestocked: new Date()
          },
          available: true
        }
      }
      return item
    }))
    
    const item = menuItems.find(item => item.id === itemId)
    toast.success(`${item.name} restocked: +${quantity} ${item.inventory.unit}`)
  }

  const updateMinThreshold = (itemId, newThreshold) => {
    setMenuItems(menuItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          inventory: {
            ...item.inventory,
            minThreshold: Math.max(0, newThreshold)
          }
        }
      }
      return item
    }))
    
    const item = menuItems.find(item => item.id === itemId)
    toast.success(`${item.name} minimum threshold updated to ${newThreshold}`)
  }

  const getInventoryStatus = (item) => {
    if (item.inventory.currentStock === 0) return 'out-of-stock'
    if (item.inventory.currentStock <= item.inventory.minThreshold) return 'low-stock'
    return 'in-stock'
  }

  const getInventoryStats = () => {
    const totalItems = menuItems.length
    const inStock = menuItems.filter(item => item.inventory.currentStock > item.inventory.minThreshold).length
    const lowStock = menuItems.filter(item => 
      item.inventory.currentStock <= item.inventory.minThreshold && item.inventory.currentStock > 0
    ).length
    const outOfStock = menuItems.filter(item => item.inventory.currentStock === 0).length
    
    return { totalItems, inStock, lowStock, outOfStock }
  }


  // Payment Management Functions
  const addPayment = (paymentData) => {
    const payment = {
      id: `PAY${String(payments.length + 1).padStart(3, '0')}`,
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      status: paymentData.amount >= paymentData.orderTotal ? 'completed' : 'partial',
      timestamp: new Date(),
      notes: paymentData.notes
    }

    setPayments([...payments, payment])
    
    // Update order status if payment is complete
    if (payment.status === 'completed') {
      const orderToUpdate = orders.find(order => order.id === paymentData.orderId)
      if (orderToUpdate && orderToUpdate.status !== 'completed') {
        updateOrderStatus(paymentData.orderId, 'completed')
      }
    }
    
    toast.success(
      <div className="flex items-center space-x-2">
        <ApperIcon name="CreditCard" className="w-4 h-4 text-green-600" />
        <div>
          <div className="font-medium">Payment Recorded</div>
          <div className="text-xs">${paymentData.amount} via {paymentData.paymentMethod}</div>
        </div>
      </div>
    )
  }

  const updatePaymentStatus = (paymentId, newStatus) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId ? { ...payment, status: newStatus } : payment
    ))
    toast.success(`Payment #${paymentId} status updated to ${newStatus}`)
  }

  const deletePayment = (paymentId) => {
    if (window.confirm(`Are you sure you want to delete Payment #${paymentId}?`)) {
      setPayments(payments.filter(payment => payment.id !== paymentId))
      toast.success(`Payment #${paymentId} deleted successfully!`)
    }
  }

  const filterPayments = () => {
    return payments.filter(payment => {
      if (paymentFilters.status !== 'All' && payment.status !== paymentFilters.status) {
        return false
      }
      if (paymentFilters.paymentMethod !== 'All' && payment.paymentMethod !== paymentFilters.paymentMethod) {
        return false
      }
      if (paymentFilters.orderId !== 'All' && payment.orderId !== paymentFilters.orderId) {
        return false
      }
      return true
    })
  }

  const handlePaymentFilterChange = (filterType, value) => {
    setPaymentFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const clearPaymentFilters = () => {
    setPaymentFilters({
      status: 'All',
      paymentMethod: 'All',
      orderId: 'All'
    })
    toast.success('Payment filters cleared')
  }

  const getPaymentStats = () => {
    const totalPayments = payments.length
    const completedPayments = payments.filter(p => p.status === 'completed').length
    const partialPayments = payments.filter(p => p.status === 'partial').length
    const pendingPayments = payments.filter(p => p.status === 'pending').length
    const totalRevenue = payments
      .filter(p => p.status === 'completed' || p.status === 'partial')
      .reduce((sum, p) => sum + p.amount, 0)
    
    return { totalPayments, completedPayments, partialPayments, pendingPayments, totalRevenue }
  }

  const paymentStats = getPaymentStats()
  const filteredPayments = filterPayments()
  const uniquePaymentMethods = [...new Set(payments.map(payment => payment.paymentMethod))]
  const uniqueOrderIds = [...new Set(payments.map(payment => payment.orderId))]


  const inventoryStats = getInventoryStats()




// Chart data and options for analytics
  const orderStatusChart = {
    series: [
      orders.filter(o => o.status === 'pending').length,
      orders.filter(o => o.status === 'preparing').length,
      orders.filter(o => o.status === 'ready').length,
      orders.filter(o => o.status === 'served').length,
      orders.filter(o => o.status === 'completed').length
    ],
    options: {
      chart: { type: 'donut', fontFamily: 'Inter' },
      labels: ['Pending', 'Preparing', 'Ready', 'Served', 'Completed'],
      colors: ['#f59e0b', '#3b82f6', '#10b981', '#6b7280', '#8b5cf6'],
      legend: { position: 'bottom' },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Orders',
                fontSize: '14px',
                color: '#6b7280'
              }
            }
          }
        }
      }
    }
  }

  const revenueChart = {
    series: [{
      name: 'Revenue',
      data: [1200, 1800, 1400, 2100, 1900, 2400, 2800]
    }],
    options: {
      chart: { type: 'area', fontFamily: 'Inter', toolbar: { show: false } },
      xaxis: { 
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: { style: { colors: '#6b7280' } }
      },
      yaxis: { labels: { style: { colors: '#6b7280' } } },
      colors: ['#2563eb'],
      stroke: { curve: 'smooth', width: 3 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3
        }
      },
      grid: { strokeDashArray: 4, borderColor: '#e5e7eb' },
      dataLabels: { enabled: false }
    }
  }

  const tableOccupancyChart = {
    series: [
      tables.filter(t => t.status === 'occupied').length,
      tables.filter(t => t.status === 'available').length,
      tables.filter(t => t.status === 'reserved').length
    ],
    options: {
      chart: { type: 'pie', fontFamily: 'Inter' },
      labels: ['Occupied', 'Available', 'Reserved'],
      colors: ['#ef4444', '#10b981', '#f59e0b'],
      legend: { position: 'bottom' },
      dataLabels: { enabled: true }
    }
  }
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
      {/* Modern Dashboard Header */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="dashboard-card bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
                Restaurant Dashboard
              </h1>
              <p className="text-white/80 text-lg">
                Welcome back! Here's what's happening at your restaurant today.
              </p>
            </div>
            <div className="floating-element">
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                <ApperIcon name="ChefHat" className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Analytics Cards */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="analytics-card group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg glow-effect">
              <ApperIcon name="ClipboardList" className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-surface-900 dark:text-surface-100 group-hover:text-blue-600 transition-colors">
                {orders.length}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Active Orders</p>
            </div>
          </div>
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (orders.length / 20) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="analytics-card group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ApperIcon name="Users" className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-surface-900 dark:text-surface-100 group-hover:text-emerald-600 transition-colors">
                {tables.filter(t => t.status === 'occupied').length}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Tables Occupied</p>
            </div>
          </div>
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(tables.filter(t => t.status === 'occupied').length / tables.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="analytics-card group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ApperIcon name="ChefHat" className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-surface-900 dark:text-surface-100 group-hover:text-amber-600 transition-colors">
                {menuItems.filter(m => m.available).length}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Available Items</p>
            </div>
          </div>
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(menuItems.filter(m => m.available).length / menuItems.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="analytics-card group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ApperIcon name="DollarSign" className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-surface-900 dark:text-surface-100 group-hover:text-purple-600 transition-colors">
                ${paymentStats.totalRevenue.toFixed(0)}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-400">Total Revenue</p>
            </div>
          </div>
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (paymentStats.totalRevenue / 5000) * 100)}%` }}
            ></div>
          </div>
        </div>
      </motion.div>

      {/* Modern Charts Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* Order Status Distribution */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Order Status</h3>
            <ApperIcon name="PieChart" className="w-5 h-5 text-surface-500" />
          </div>
          <Chart 
            options={orderStatusChart.options} 
            series={orderStatusChart.series} 
            type="donut" 
            height={250}
          />
        </div>

        {/* Weekly Revenue Trend */}
        <div className="chart-container lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Weekly Revenue Trend</h3>
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-surface-500" />
          </div>
          <Chart 
            options={revenueChart.options} 
            series={revenueChart.series} 
            type="area" 
            height={250}
          />
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="metric-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <ApperIcon name="Clock" className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Avg. Prep Time</p>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100">18 min</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Customer Satisfaction</p>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100">4.8/5</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <ApperIcon name="Star" className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Popular Item</p>
              <p className="text-lg font-bold text-surface-900 dark:text-surface-100">Margherita Pizza</p>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <ApperIcon name="Package" className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-surface-600 dark:text-surface-400">Low Stock Items</p>
              <p className="text-xl font-bold text-surface-900 dark:text-surface-100">{inventoryStats.lowStock}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table Occupancy Visualization */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        <div className="chart-container">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Table Status</h3>
            <ApperIcon name="Grid3X3" className="w-5 h-5 text-surface-500" />
          </div>
          <Chart 
            options={tableOccupancyChart.options} 
            series={tableOccupancyChart.series} 
            type="pie" 
            height={200}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">Live Table Status</h3>
            <div className="grid grid-cols-4 gap-3">
              {tables.map((table) => (
                <motion.div
                  key={table.id}
                  whileHover={{ scale: 1.05 }}
                  className={`aspect-square rounded-xl p-3 text-center transition-all duration-300 ${
                    table.status === 'available' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    table.status === 'occupied' ? 'bg-red-100 text-red-800 border border-red-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <ApperIcon name="Users" className="w-4 h-4 mb-1" />
                    <span className="text-xs font-bold">{table.number}</span>
                    <span className="text-xs opacity-75">{table.capacity}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
                  {['All', 'pending', 'preparing', 'ready', 'served', 'completed'].map((status) => {

                    const isActive = filters.status === status
                    const statusLabels = {
                      'All': 'All Orders',
                      'pending': 'Pending',
                      'preparing': 'Preparing', 
                      'ready': 'Ready',
                      'served': 'Served',
                      'completed': 'Completed'
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
                              status === 'served' ? 'bg-gray-400' :
                              'bg-purple-400'
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
                      <option value="served">📋 Served Orders</option>
                      <option value="completed">🎉 Completed Orders</option>

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

                  {/* Order Actions */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editOrder(order)}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1"
                      >
                        <ApperIcon name="Edit" className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1"
                      >
                        <ApperIcon name="Trash2" className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>


                  {/* Status Update Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'preparing', 'ready', 'served', 'completed'].map((status) => (

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
        
        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Inventory Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-elegant text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Check" className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{inventoryStats.inStock}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">In Stock</p>
              </div>
              
              <div className="card-elegant text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="AlertTriangle" className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{inventoryStats.lowStock}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Low Stock</p>
              </div>
              
              <div className="card-elegant text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="X" className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{inventoryStats.outOfStock}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Out of Stock</p>
              </div>
              
              <div className="card-elegant text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Package" className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{inventoryStats.totalItems}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Total Items</p>
              </div>
            </div>

            {/* Enhanced Inventory Management Header */}
            <div className="card-elegant">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 flex items-center">
                    <ApperIcon name="Package" className="w-5 h-5 mr-2 text-primary" />
                    Inventory & Alert Management
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                    Monitor stock levels and configure automatic alerts for all menu items
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const alertCount = menuItems.filter(item => 
                        item.inventory.currentStock <= item.inventory.minThreshold
                      ).length
                      if (alertCount > 0) {
                        toast.info(
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Bell" className="w-4 h-4 text-blue-600" />
                            <div>
                              <div className="font-medium">Alert Summary</div>
                              <div className="text-xs">{alertCount} items need attention</div>
                            </div>
                          </div>,
                          { autoClose: 3000 }
                        )
                      } else {
                        toast.success('All items are well stocked!')
                      }
                    }}
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                  >
                    <ApperIcon name="Bell" className="w-4 h-4" />
                    <span>Check Alerts</span>
                  </button>
                  <button
                    onClick={() => {
                      menuItems.forEach(item => {
                        if (item.inventory.currentStock <= item.inventory.minThreshold) {
                          restockItem(item.id, item.inventory.minThreshold * 2)
                        }
                      })
                    }}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <ApperIcon name="RefreshCw" className="w-4 h-4" />
                    <span>Auto Restock Low Items</span>
                  </button>
                </div>
              </div>
              
              {/* Alert Statistics */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-green-800 dark:text-green-200">Well Stocked</div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      {menuItems.filter(item => item.inventory.currentStock > item.inventory.minThreshold).length} items
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="text-sm font-medium text-amber-800 dark:text-amber-200">Low Stock Alerts</div>
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                      {menuItems.filter(item => 
                        item.inventory.currentStock <= item.inventory.minThreshold && item.inventory.currentStock > 0
                      ).length} items
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <ApperIcon name="XCircle" className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-sm font-medium text-red-800 dark:text-red-200">Critical Alerts</div>
                    <div className="text-xs text-red-600 dark:text-red-400">
                      {menuItems.filter(item => item.inventory.currentStock === 0).length} items
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Grid */}
            <div className="inventory-grid">
              {menuItems.map((item) => {
                const inventoryStatus = getInventoryStatus(item)
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`card-elegant overflow-hidden inventory-card ${inventoryStatus} ${
                      item.inventory.currentStock <= Math.ceil(item.inventory.minThreshold * 0.5) && item.inventory.currentStock > 0
                        ? 'animate-pulse-slow border-red-400 shadow-red-200'
                        : item.inventory.currentStock <= item.inventory.minThreshold && item.inventory.currentStock > 0
                        ? 'animate-bounce-gentle border-amber-400'
                        : ''
                    }`}
                  >

                    {/* Item Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-surface-900 dark:text-surface-100">{item.name}</h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">{item.category}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium stock-status ${inventoryStatus} flex items-center space-x-1`}>
                        {inventoryStatus === 'in-stock' && (
                          <><ApperIcon name="Check" className="w-3 h-3" /><span>In Stock</span></>
                        )}
                        {inventoryStatus === 'low-stock' && (
                          <><ApperIcon name="AlertTriangle" className="w-3 h-3" /><span>Low Stock</span></>
                        )}
                        {inventoryStatus === 'out-of-stock' && (
                          <><ApperIcon name="X" className="w-3 h-3" /><span>Out of Stock</span></>
                        )}
                        {item.inventory.currentStock <= Math.ceil(item.inventory.minThreshold * 0.5) && item.inventory.currentStock > 0 && (
                          <ApperIcon name="Bell" className="w-3 h-3 text-red-600 animate-wiggle" />
                        )}
                      </div>
                    </div> {/* Closing div for item header */}

                    {/* Stock Information */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Current Stock:</span>
                        <span className="font-medium text-surface-900 dark:text-surface-100">
                          {item.inventory.currentStock} {item.inventory.unit}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Min. Threshold:</span>
                        <span className="font-medium text-surface-900 dark:text-surface-100">
                          {item.inventory.minThreshold} {item.inventory.unit}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Supplier:</span>
                        <span className="font-medium text-surface-900 dark:text-surface-100 text-xs">
                          {item.inventory.supplier}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Last Restocked:</span>
                        <span className="font-medium text-surface-900 dark:text-surface-100 text-xs">
                          {item.inventory.lastRestocked.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Stock Level Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-surface-500">Stock Level</span>
                        <span className="text-xs text-surface-500">
                          {Math.round((item.inventory.currentStock / (item.inventory.minThreshold * 2)) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-surface-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            inventoryStatus === 'out-of-stock' ? 'bg-red-500' :
                            inventoryStatus === 'low-stock' ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (item.inventory.currentStock / (item.inventory.minThreshold * 2)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Quick Stock Adjustment */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateInventoryStock(item.id, item.inventory.currentStock - 1, 'Manual decrease')}
                          disabled={item.inventory.currentStock === 0}
                          className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ApperIcon name="Minus" className="w-3 h-3" />
                        </button>
                        
                        <input
                          type="number"
                          value={item.inventory.currentStock}
                          onChange={(e) => updateInventoryStock(item.id, parseInt(e.target.value) || 0, 'Direct input')}
                          className="flex-1 px-2 py-1 border border-surface-300 dark:border-surface-600 rounded text-center text-sm bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100"
                          min="0"
                        />
                        
                        <button
                          onClick={() => updateInventoryStock(item.id, item.inventory.currentStock + 1, 'Manual increase')}
                          className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded text-xs font-medium transition-all duration-200"
                        >
                          <ApperIcon name="Plus" className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => restockItem(item.id, 10)}
                          className="flex-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1"
                        >
                          <ApperIcon name="Plus" className="w-3 h-3" />
                          <span>Restock +10</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            const newThreshold = prompt(`Enter new minimum threshold for ${item.name}:`, item.inventory.minThreshold)
                            if (newThreshold && !isNaN(newThreshold)) {
                              updateMinThreshold(item.id, parseInt(newThreshold))
                            }
                          }}
                          className="px-3 py-1 bg-surface-100 hover:bg-surface-200 text-surface-700 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1"
                        >
                          <ApperIcon name="Settings" className="w-3 h-3" />
                          <span>Threshold</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'payments' && (
          <motion.div
            key="payments"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Payment Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-elegant text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Check" className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{paymentStats.completedPayments}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Completed</p>
              </div>
              
              <div className="card-elegant text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Clock" className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{paymentStats.pendingPayments}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Pending</p>
              </div>
              
              <div className="card-elegant text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Percent" className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{paymentStats.partialPayments}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Partial</p>
              </div>
              
              <div className="card-elegant text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="DollarSign" className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  ${paymentStats.totalRevenue.toFixed(0)}
                </p>
                <p className="text-sm text-surface-600 dark:text-surface-400">Total Revenue</p>
              </div>
            </div>

            {/* Add New Payment */}
            <div className="card-elegant">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100 flex items-center">
                    <ApperIcon name="Plus" className="w-5 h-5 mr-2 text-primary" />
                    Record Payment
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                    Manually record payments received for orders
                  </p>
                </div>
                <button
                  onClick={() => setIsAddPaymentModalOpen(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span>Add Payment</span>
                </button>
              </div>
            </div>

            {/* Payment Filters */}
            <div className="filter-card">
              <div className="filter-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Filter" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Payment Filters</h3>
                      <p className="text-white/80 text-sm">Filter payments by status, method, and order</p>
                    </div>
                  </div>
                  <button
                    onClick={clearPaymentFilters}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                  >
                    <ApperIcon name="RotateCcw" className="w-4 h-4" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div className="filter-control">
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2 text-primary" />
                    Payment Status
                  </label>
                  <select
                    value={paymentFilters.status}
                    onChange={(e) => handlePaymentFilterChange('status', e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Payment Method Filter */}
                <div className="filter-control">
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center">
                    <ApperIcon name="CreditCard" className="w-4 h-4 mr-2 text-primary" />
                    Payment Method
                  </label>
                  <select
                    value={paymentFilters.paymentMethod}
                    onChange={(e) => handlePaymentFilterChange('paymentMethod', e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Methods</option>
                    {uniquePaymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                {/* Order Filter */}
                <div className="filter-control">
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex items-center">
                    <ApperIcon name="ClipboardList" className="w-4 h-4 mr-2 text-primary" />
                    Order ID
                  </label>
                  <select
                    value={paymentFilters.orderId}
                    onChange={(e) => handlePaymentFilterChange('orderId', e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All Orders</option>
                    {uniqueOrderIds.map(orderId => (
                      <option key={orderId} value={orderId}>Order #{orderId}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Results */}
              <div className="filter-results-card mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <ApperIcon name="Search" className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                        {filteredPayments.length} Payments Found
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        Out of {payments.length} total payments
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredPayments.map((payment) => {
                const relatedOrder = orders.find(order => order.id === payment.orderId)
                const paymentStatusColors = {
                  completed: 'payment-completed',
                  pending: 'payment-pending',
                  partial: 'payment-partial',
                  failed: 'payment-failed'
                }

                return (
                  <motion.div
                    key={payment.id}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="card-elegant"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                          Payment #{payment.id}
                        </h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400">
                          Order #{payment.orderId} • {relatedOrder?.customerName || 'Unknown'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${paymentStatusColors[payment.status]}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Amount:</span>
                        <span className="font-bold text-lg text-surface-900 dark:text-surface-100">
                          ${payment.amount.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Method:</span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium payment-method-${payment.paymentMethod.toLowerCase()}`}>
                          {payment.paymentMethod}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-surface-600 dark:text-surface-400">Time:</span>
                        <span className="text-xs text-surface-500 dark:text-surface-400">
                          {payment.timestamp.toLocaleString()}
                        </span>
                      </div>

                      {payment.notes && (
                        <div>
                          <span className="text-sm text-surface-600 dark:text-surface-400">Notes:</span>
                          <p className="text-sm text-surface-700 dark:text-surface-300 mt-1">
                            {payment.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Payment Actions */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => deletePayment(payment.id)}
                          className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1"
                        >
                          <ApperIcon name="Trash2" className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Status Update Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'completed', 'partial', 'failed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updatePaymentStatus(payment.id, status)}
                          disabled={payment.status === status}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                            payment.status === status
                              ? 'bg-surface-200 text-surface-600 cursor-not-allowed'
                              : 'bg-surface-100 hover:bg-surface-200 text-surface-700 hover:text-surface-900'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {filteredPayments.length === 0 && (
              <div className="card-elegant text-center py-12">
                <ApperIcon name="CreditCard" className="w-16 h-16 mx-auto mb-4 text-surface-400" />
                <h3 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
                  No Payments Found
                </h3>
                <p className="text-surface-600 dark:text-surface-400 mb-4">
                  {payments.length === 0 
                    ? 'No payments have been recorded yet.' 
                    : 'No payments match your current filters.'}
                </p>
                <button
                  onClick={() => setIsAddPaymentModalOpen(true)}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span>Record First Payment</span>
                </button>
              </div>
            )}
          </motion.div>
        )}



      </AnimatePresence>

      {/* Add Order Modal */}

      {/* Edit Order Modal */}
      {editingOrder && (
        <AddOrderModal
          isOpen={isEditOrderModalOpen}
          onClose={() => {
            setIsEditOrderModalOpen(false)
            setEditingOrder(null)
          }}
          onAddOrder={updateOrder}
          menuItems={menuItems}
          tables={tables}
          editMode={true}
          initialData={{
            tableNumber: editingOrder.tableNumber.toString(),
            customerName: editingOrder.customerName,
            selectedItems: menuItems.filter(item => 
              editingOrder.items.some(orderItem => orderItem.includes(item.name))
            ),
            notes: editingOrder.notes || ''
          }}
        />
      )}

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

      {/* Add Payment Modal */}
      {isAddPaymentModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-backdrop"
          onClick={() => setIsAddPaymentModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100 flex items-center">
                <ApperIcon name="CreditCard" className="w-5 h-5 mr-2 text-primary" />
                Record Payment
              </h2>
              <button
                onClick={() => setIsAddPaymentModalOpen(false)}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const paymentData = {
                orderId: formData.get('orderId'),
                amount: parseFloat(formData.get('amount')),
                paymentMethod: formData.get('paymentMethod'),
                notes: formData.get('notes'),
                orderTotal: orders.find(o => o.id === formData.get('orderId'))?.totalAmount || 0
              }
              
              if (!paymentData.orderId) {
                toast.error('Please select an order')
                return
              }
              if (!paymentData.amount || paymentData.amount <= 0) {
                toast.error('Please enter a valid payment amount')
                return
              }
              
              addPayment(paymentData)
              setIsAddPaymentModalOpen(false)
              e.target.reset()
            }}>
              <div className="modal-body space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Select Order *
                    </label>
                    <select
                      name="orderId"
                      className="input-modern"
                      required
                    >
                      <option value="">Choose an order</option>
                      {orders.filter(order => order.status !== 'completed').map(order => (
                        <option key={order.id} value={order.id}>
                          Order #{order.id} - {order.customerName} (${order.totalAmount.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Payment Method *
                    </label>
                    <select
                      name="paymentMethod"
                      className="input-modern"
                      required
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Credit/Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Check">Check</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Payment Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0.01"
                    className="input-modern"
                    placeholder="Enter amount received"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    className="input-modern"
                    rows={3}
                    placeholder="Additional notes about the payment..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsAddPaymentModalOpen(false)}
                  className="px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <ApperIcon name="Save" className="w-4 h-4" />
                  <span>Record Payment</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

    </div>
  )
}

export default MainFeature