import { format, isSameMonth, parseISO } from 'date-fns';
import { categoryColors } from './constants.js';

export const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const toNumber = (value) => Number(value || 0);

export function getSummary(transactions, budget) {
  const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + toNumber(item.amount), 0);
  const expenses = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + toNumber(item.amount), 0);
  const monthExpenses = transactions
    .filter((item) => item.type === 'expense' && isSameMonth(parseISO(item.date), new Date()))
    .reduce((sum, item) => sum + toNumber(item.amount), 0);

  return {
    income,
    expenses,
    balance: income - expenses,
    savings: income - expenses,
    monthlySpent: monthExpenses,
    remainingBudget: Math.max(toNumber(budget?.monthly_limit) - monthExpenses, 0),
  };
}

export function monthlySeries(transactions) {
  const buckets = new Map();

  transactions.forEach((item) => {
    const key = format(parseISO(item.date), 'MMM yyyy');
    const current = buckets.get(key) || { month: key, income: 0, expense: 0 };
    current[item.type] += toNumber(item.amount);
    buckets.set(key, current);
  });

  return Array.from(buckets.values()).slice(-6);
}

export function categorySeries(transactions) {
  const buckets = new Map();

  transactions
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      const name = item.category || 'Others';
      buckets.set(name, (buckets.get(name) || 0) + toNumber(item.amount));
    });

  return Array.from(buckets.entries()).map(([name, value]) => ({
    name,
    value,
    fill: categoryColors[name] || categoryColors.Others,
  }));
}
