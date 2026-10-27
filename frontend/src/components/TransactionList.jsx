import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CategoryIcon from './CategoryIcon';
import { shortDate } from '../utils/dates';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const { formatAmount } = useTheme();
  const actions = (tx) => (
    <div className="flex items-center justify-end gap-0.5">
      <button type="button" onClick={() => onEdit(tx)} className="icon-button h-9 w-9 hover:text-brand-600" aria-label={`Edit ${tx.description}`} title="Edit transaction"><Pencil className="h-3.5 w-3.5" /></button>
      <button type="button" onClick={() => onDelete(tx.id)} className="icon-button h-9 w-9 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${tx.description}`} title="Delete transaction"><Trash2 className="h-3.5 w-3.5" /></button>
    </div>
  );

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="data-table">
          <caption className="sr-only">Transactions, their categories, dates, amounts, and available actions</caption>
          <thead><tr><th scope="col">Transaction</th><th scope="col">Category</th><th scope="col">Date</th><th scope="col" className="text-right">Amount</th><th scope="col" className="text-right">Actions</th></tr></thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td><div className="flex items-center gap-3"><CategoryIcon name={tx.category_name} type={tx.type} /><div><p className="max-w-[260px] truncate text-xs font-semibold text-slate-700" title={tx.description}>{tx.description}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">{tx.type === 'Income' ? <ArrowDownLeft className="h-3 w-3 text-brand-500" /> : <ArrowUpRight className="h-3 w-3 text-slate-400" />}{tx.type}</p></div></div></td>
                <td><span className="badge-neutral whitespace-nowrap">{tx.category_name || 'Uncategorized'}</span></td>
                <td className="whitespace-nowrap text-[11px] text-slate-400">{shortDate(tx.transaction_date)}</td>
                <td className={`amount whitespace-nowrap text-right text-xs font-bold ${tx.type === 'Income' ? 'text-brand-600' : 'text-slate-700'}`}>{tx.type === 'Income' ? '+' : '−'}{formatAmount(tx.amount)}</td>
                <td>{actions(tx)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-slate-100 md:hidden">
        {transactions.map((tx) => (
          <li key={tx.id} className="px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3"><CategoryIcon name={tx.category_name} type={tx.type} /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-700">{tx.description}</p><p className="mt-1 text-[10px] text-slate-400">{tx.category_name}</p></div><p className={`amount shrink-0 text-xs font-bold ${tx.type === 'Income' ? 'text-brand-600' : 'text-slate-700'}`}>{tx.type === 'Income' ? '+' : '−'}{formatAmount(tx.amount)}</p></div>
            <div className="ml-[52px] mt-1 flex items-center justify-between"><span className="text-[10px] text-slate-400">{shortDate(tx.transaction_date)} · {tx.type}</span>{actions(tx)}</div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TransactionList;
