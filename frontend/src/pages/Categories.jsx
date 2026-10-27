import React, { useState, useEffect } from 'react';
import { Tag, Plus, Pencil, Trash2, ArrowDownLeft, ArrowUpRight, Check, Loader2, LockKeyhole } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import PageHeader from '../components/PageHeader';
import CategoryIcon from '../components/CategoryIcon';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Alert, EmptyState, LoadingState } from '../components/Feedback';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [type, setType] = useState('Expense');
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true); setPageError('');
    try { const response = await api.get('/categories'); setCategories(response.data); }
    catch { setPageError('Unable to load your categories. Please try again.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchCategories(); }, []);

  const openCategory = (category = null) => {
    setEditingCategory(category); setCategoryName(category?.category_name || ''); setType(category?.type || 'Expense'); setError(''); setIsModalOpen(true);
  };
  const handleSave = async (event) => {
    event.preventDefault(); setError('');
    if (!categoryName.trim()) { setError('Enter a name for your category.'); return; }
    setSaving(true);
    try {
      if (editingCategory) await api.put(`/categories/${editingCategory.id}`, { category_name: categoryName.trim() });
      else await api.post('/categories', { category_name: categoryName.trim(), type });
      setIsModalOpen(false); fetchCategories();
    } catch (err) { setError(err.response?.data?.message || 'Unable to save this category.'); }
    finally { setSaving(false); }
  };
  const handleDelete = async () => {
    setDeleteError(''); setDeleteLoading(true);
    try { await api.delete(`/categories/${deleteId}`); setDeleteId(null); fetchCategories(); }
    catch (err) { setDeleteError(err.response?.data?.message || 'This category is in use and cannot be deleted.'); }
    finally { setDeleteLoading(false); }
  };

  return (
    <MainLayout>
      <div className="page-stack">
        <PageHeader title="Categories" description="A place for every transaction. Organize your money your way."><button onClick={() => openCategory()} className="btn-primary"><Plus className="h-4 w-4" />Add category</button></PageHeader>
        {pageError && <Alert>{pageError} <button onClick={fetchCategories} className="font-semibold underline">Try again</button></Alert>}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
          {['Expense', 'Income'].map((categoryType) => {
            const group = categories.filter((category) => category.type === categoryType);
            const isIncome = categoryType === 'Income';
            const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
            return (
              <section key={categoryType} className="surface overflow-hidden">
                <div className="surface-header"><div className="flex items-center gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${isIncome ? 'bg-brand-50 text-brand-600' : 'bg-orange-50 text-orange-500'}`}><Icon className="h-5 w-5" /></span><div><h2 className="section-title">{isIncome ? 'Income' : 'Expenses'}</h2><p className="section-description">{isIncome ? 'The ways money comes in.' : 'The things you spend on.'}</p></div></div><span className="badge-neutral">{group.length} {group.length === 1 ? 'category' : 'categories'}</span></div>
                {loading ? <LoadingState label="Loading categories…" /> : group.length ? <ul className="divide-y divide-slate-100 px-5 sm:px-6">{group.map((category) => <li key={category.id} className="flex items-center justify-between gap-3 py-4"><div className="flex min-w-0 items-center gap-3"><CategoryIcon name={category.category_name} type={category.type} /><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-700">{category.category_name}</p><p className="mt-1 text-[10px] text-slate-400">{category.user_id ? 'Custom category' : 'Built-in category'}</p></div></div>{category.user_id ? <div className="flex shrink-0 items-center"><button onClick={() => openCategory(category)} className="icon-button h-9 w-9" aria-label={`Rename ${category.category_name}`} title="Rename category"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => { setDeleteError(''); setDeleteId(category.id); }} className="icon-button h-9 w-9 hover:bg-rose-50 hover:text-rose-500" aria-label={`Delete ${category.category_name}`} title="Delete category"><Trash2 className="h-3.5 w-3.5" /></button></div> : <span className="badge-neutral"><LockKeyhole className="h-3 w-3" />Default</span>}</li>)}</ul> : <EmptyState icon={Tag} title={`No ${categoryType.toLowerCase()} categories yet`} description="Create a category that fits your everyday life." />}
              </section>
            );
          })}
        </div>
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" />Built-in categories keep things simple. Add your own for the things that make your budget unique.</p>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Rename category' : 'Create a category'} description="Make your transactions easier to find and understand." size="sm" busy={saving}>
        <form onSubmit={handleSave} className="space-y-5">
          {error && <Alert>{error}</Alert>}
          {!editingCategory && <div><label className="field-label">Transaction type</label><div className="segmented-control grid grid-cols-2" role="group" aria-label="Category transaction type">{['Expense', 'Income'].map((value) => <button type="button" key={value} disabled={saving} onClick={() => setType(value)} className="segmented-option" aria-pressed={type === value}>{value}</button>)}</div></div>}
          <div><label htmlFor="category-name" className="field-label">Category name</label><input id="category-name" data-autofocus required maxLength={80} disabled={saving} value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="e.g. Coffee & little treats" className="input" /></div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5"><button type="button" disabled={saving} onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{saving ? 'Saving…' : 'Save category'}</button></div>
        </form>
      </Modal>
      <ConfirmModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleteLoading} error={deleteError} title="Delete category?" message="This custom category will be removed. Categories linked to transactions cannot be deleted." />
    </MainLayout>
  );
};

export default Categories;
