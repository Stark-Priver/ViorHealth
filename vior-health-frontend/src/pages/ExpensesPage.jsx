import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, Receipt, Eye, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ExpensesPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    reference_number: '',
    notes: ''
  });

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'card', label: 'Card' }
  ];

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/expenses/expenses/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/expenses/categories/');
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedCategory) {
        await api.put(`/expenses/categories/${selectedCategory.id}/`, categoryFormData);
        toast.success('Category updated successfully');
      } else {
        await api.post('/expenses/categories/', categoryFormData);
        toast.success('Category added successfully');
      }
      
      fetchCategories();
      handleCloseCategoryModal();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryFormData({ name: category.name, description: category.description || '' });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await api.delete(`/expenses/categories/${id}/`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setSelectedCategory(null);
    setCategoryFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Ensure amount is a number
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (showEditModal && selectedExpense) {
        await api.put(`/expenses/expenses/${selectedExpense.id}/`, expenseData);
        toast.success('Expense updated successfully');
      } else {
        await api.post('/expenses/expenses/', expenseData);
        toast.success('Expense added successfully');
      }
      
      fetchExpenses();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving expense:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message 
        || Object.values(error.response?.data || {}).flat().join(', ')
        || 'Failed to save expense';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      expense_date: expense.expense_date,
      payment_method: expense.payment_method,
      reference_number: expense.reference_number || '',
      notes: expense.notes || ''
    });
    setShowEditModal(true);
  };

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await api.delete(`/expenses/expenses/${id}/`);
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete expense';
      toast.error(errorMessage);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/expenses/expenses/${id}/approve/`);
      toast.success('Expense approved successfully');
      fetchExpenses();
    } catch (error) {
      console.error('Error approving expense:', error);
      const errorMessage = error.response?.data?.error || 'Failed to approve expense';
      toast.error(errorMessage);
    }
  };

  const handleUnapprove = async (id) => {
    if (!window.confirm('Are you sure you want to unapprove this expense? This will allow the user to edit it.')) return;
    
    try {
      await api.post(`/expenses/expenses/${id}/unapprove/`);
      toast.success('Expense unapproved successfully');
      fetchExpenses();
    } catch (error) {
      console.error('Error unapproving expense:', error);
      const errorMessage = error.response?.data?.error || 'Failed to unapprove expense';
      toast.error(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedExpense(null);
    setFormData({
      category: '',
      description: '',
      amount: '',
      expense_date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      reference_number: '',
      notes: ''
    });
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Category', 'Description', 'Amount', 'Payment Method', 'Reference'].join(','),
      ...filteredExpenses.map(expense => [
        expense.expense_date,
        expense.category,
        expense.description,
        expense.amount,
        expense.payment_method,
        expense.reference_number || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    
    let matchesDate = true;
    if (filterDateRange !== 'all') {
      const expenseDate = new Date(expense.expense_date);
      const today = new Date();
      const diffTime = today - expenseDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (filterDateRange === 'today') matchesDate = diffDays === 0;
      else if (filterDateRange === 'week') matchesDate = diffDays <= 7;
      else if (filterDateRange === 'month') matchesDate = diffDays <= 30;
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Expenses</h1>
          <p className="text-neutral-600">
            {isAdmin ? 'Track and manage all company expenses' : 'Record and track your expenses'}
          </p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Button variant="outline" onClick={() => setShowCategoryModal(true)} Icon={Plus}>
              Manage Categories
            </Button>
          )}
          <Button onClick={() => setShowAddModal(true)} Icon={Plus}>
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">
                {isAdmin ? 'Total Expenses' : 'My Total Expenses'}
              </p>
              <p className="text-2xl font-bold text-neutral-800">
                TZS {totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Receipt className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">
                {isAdmin ? 'Total Transactions' : 'My Transactions'}
              </p>
              <p className="text-2xl font-bold text-neutral-800">{filteredExpenses.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Receipt className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Average Expense</p>
              <p className="text-2xl font-bold text-neutral-800">
                TZS {filteredExpenses.length > 0 
                  ? (totalExpenses / filteredExpenses.length).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : '0.00'}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <Receipt className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>
      </div>

      {!isAdmin && (
        <Card className="mb-6 bg-primary-50 border-primary-200">
          <p className="text-sm text-primary-700">
            <strong>Note:</strong> You can only view and manage expenses that you have recorded.
          </p>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <Button variant="outline" onClick={handleExport} Icon={Download}>
            Export
          </Button>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-neutral-600">Loading expenses...</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">No expenses found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                      {new Date(expense.expense_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info">{expense.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-800">
                      TZS {parseFloat(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 capitalize">
                      {expense.payment_method.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {expense.reference_number || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.is_approved ? (
                        <Badge variant="success">Approved</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleView(expense)}
                        className="text-neutral-600 hover:text-neutral-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(!expense.is_approved || isAdmin) && (
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {(!expense.is_approved || isAdmin) && (
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {isAdmin && !expense.is_approved && (
                        <button
                          onClick={() => handleApprove(expense.id)}
                          className="text-success-600 hover:text-success-900"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {isAdmin && expense.is_approved && (
                        <button
                          onClick={() => handleUnapprove(expense.id)}
                          className="text-warning-600 hover:text-warning-900"
                          title="Unapprove"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add/Edit Expense Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={handleCloseModal}
        title={showEditModal ? 'Edit Expense' : 'Add New Expense'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="mt-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  + Manage Categories
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter expense description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Amount (TZS) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Expense Date *
              </label>
              <input
                type="date"
                required
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Payment Method *
              </label>
              <select
                required
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                value={formData.reference_number}
                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Receipt/Invoice number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {showEditModal ? 'Update Expense' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Category Management Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={handleCloseCategoryModal}
        title={selectedCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleCategorySubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Office Supplies"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                value={categoryFormData.description}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Optional description..."
              />
            </div>

            {/* Existing Categories List */}
            {!selectedCategory && categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Existing Categories
                </label>
                <div className="border border-neutral-200 rounded-lg max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50">
                      <div>
                        <p className="font-medium text-sm text-neutral-800">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-neutral-600">{cat.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditCategory(cat)}
                          className="text-primary-600 hover:text-primary-900 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={handleCloseCategoryModal}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedCategory ? 'Update Category' : 'Add Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Expense Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Expense Details"
      >
        {selectedExpense && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Date
                </label>
                <p className="text-sm text-neutral-900">
                  {new Date(selectedExpense.expense_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Category
                </label>
                <Badge variant="info">{selectedExpense.category}</Badge>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <p className="text-sm text-neutral-900">{selectedExpense.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Amount
                </label>
                <p className="text-lg font-semibold text-neutral-900">
                  TZS {parseFloat(selectedExpense.amount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Payment Method
                </label>
                <p className="text-sm text-neutral-900 capitalize">
                  {selectedExpense.payment_method.replace('_', ' ')}
                </p>
              </div>

              {selectedExpense.reference_number && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Reference Number
                  </label>
                  <p className="text-sm text-neutral-900">{selectedExpense.reference_number}</p>
                </div>
              )}

              {selectedExpense.notes && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Notes
                  </label>
                  <p className="text-sm text-neutral-900 bg-neutral-50 p-3 rounded">
                    {selectedExpense.notes}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Status
                </label>
                {selectedExpense.is_approved ? (
                  <Badge variant="success">Approved</Badge>
                ) : (
                  <Badge variant="warning">Pending Approval</Badge>
                )}
              </div>

              {selectedExpense.is_approved && selectedExpense.approved_by_name && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Approved By
                  </label>
                  <p className="text-sm text-neutral-900 font-medium">
                    {selectedExpense.approved_by_name}
                  </p>
                  <p className="text-xs text-neutral-600 mt-1">
                    on {new Date(selectedExpense.approved_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              <div className="col-span-2 pt-4 border-t border-neutral-200">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Recorded By
                </label>
                <p className="text-sm text-neutral-900 font-medium">
                  {selectedExpense.created_by_name || 'Unknown'}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  on {new Date(selectedExpense.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {selectedExpense.updated_at !== selectedExpense.created_at && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Last Updated
                  </label>
                  <p className="text-xs text-neutral-600">
                    {new Date(selectedExpense.updated_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200">
              <Button type="button" variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              {(!selectedExpense.is_approved || isAdmin) && (
                <Button 
                  type="button" 
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedExpense);
                  }}
                  Icon={Edit}
                >
                  Edit Expense
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExpensesPage;
