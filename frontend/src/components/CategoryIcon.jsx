import React from 'react';
import { Utensils, ShoppingBag, Car, Home, Zap, Heart, Film, Briefcase, Gift, GraduationCap, Wallet, Tag, Coffee } from 'lucide-react';

const categories = [
  [/food|dining|restaurant|grocery|groceries/i, Utensils, 'bg-orange-50 text-orange-500'],
  [/coffee|cafe/i, Coffee, 'bg-amber-50 text-amber-600'],
  [/transport|travel|fuel|car/i, Car, 'bg-blue-50 text-blue-500'],
  [/shop|clothing/i, ShoppingBag, 'bg-violet-50 text-violet-500'],
  [/rent|home|housing/i, Home, 'bg-sky-50 text-sky-600'],
  [/bill|utilit/i, Zap, 'bg-amber-50 text-amber-500'],
  [/health|medical|fitness/i, Heart, 'bg-rose-50 text-rose-500'],
  [/entertain|subscription/i, Film, 'bg-indigo-50 text-indigo-500'],
  [/salary|work|freelance|business/i, Briefcase, 'bg-brand-50 text-brand-600'],
  [/gift|bonus/i, Gift, 'bg-pink-50 text-pink-500'],
  [/education|school/i, GraduationCap, 'bg-cyan-50 text-cyan-600'],
];

const CategoryIcon = ({ name = '', type, className = '' }) => {
  const [, Icon, colors] = categories.find(([pattern]) => pattern.test(name)) || [null, type === 'Income' ? Wallet : Tag, type === 'Income' ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-500'];
  return <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors} ${className}`}><Icon className="h-[18px] w-[18px]" strokeWidth={1.7} /></span>;
};

export default CategoryIcon;
