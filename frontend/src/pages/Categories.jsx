import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { Tag, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [type, setType] = useState('Expense');
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!categoryName.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, { category_name: categoryName.trim() });
      } else {
        await api.post('/categories', { category_name: categoryName.trim(), type });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteError('');
    try {
      await api.delete(`/categories/${deleteId}`);
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Cannot delete category in use.');
    }
  };

  const incomeCategories = categories.filter((c) => c.type === 'Income');
  const expenseCategories = categories.filter((c) => c.type === 'Expense');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage transaction income and expense classifications</p>
          </div>
          <button
            onClick={() => { setEditingCategory(null); setCategoryName(''); setType('Expense'); setError(''); setIsModalOpen(true); }}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Custom Category</span>
          </button>
        </div>

        {deleteError && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex justify-between items-center">
            <span>{deleteError}</span>
            <button onClick={() => setDeleteError('')} className="text-rose-500 hover:text-rose-700"><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Categories */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" /> Income Categories
            </h3>
            <div className="space-y-2">
              {incomeCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100/80 transition-colors">
                  <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{cat.category_name}</span>
                  {cat.user_id ? (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => { setEditingCategory(cat); setCategoryName(cat.category_name); setType(cat.type); setIsModalOpen(true); }}
                        className="p-1 text-gray-400 hover:text-indigo-600"
                        title="Rename"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(cat.id)}
                        className="p-1 text-gray-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600">Default</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Expense Categories */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" /> Expense Categories
            </h3>
            <div className="space-y-2">
              {expenseCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100/80 transition-colors">
                  <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{cat.category_name}</span>
                  {cat.user_id ? (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => { setEditingCategory(cat); setCategoryName(cat.category_name); setType(cat.type); setIsModalOpen(true); }}
                        className="p-1 text-gray-400 hover:text-indigo-600"
                        title="Rename"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(cat.id)}
                        className="p-1 text-gray-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-600">Default</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {editingCategory ? 'Rename Category' : 'Add Custom Category'}
                </h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              {error && <p className="text-xs text-rose-500 mb-3">{error}</p>}

              <form onSubmit={handleSave} className="space-y-4">
                {!editingCategory && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setType('Expense')}
                        className={`py-1.5 text-xs font-semibold rounded-lg ${type === 'Expense' ? 'bg-rose-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                      >
                        Expense
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('Income')}
                        className={`py-1.5 text-xs font-semibold rounded-lg ${type === 'Income' ? 'bg-emerald-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                      >
                        Income
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="e.g. Subscriptions"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm outline-none"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 py-2 rounded-xl border text-sm font-semibold">Cancel</button>
                  <button type="submit" className="w-1/2 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Category"
          message="Are you sure you want to delete this custom category?"
        />
      </div>
    </MainLayout>
  );
};

export default Categories;
