import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { supabase } from '../lib/supabase.js';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const { user, configured } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!configured || !user) return;
    setLoading(true);

    const [txRes, goalsRes, budgetRes] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('savings_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('budgets').select('*').eq('user_id', user.id).maybeSingle(),
    ]);

    if (txRes.error) throw txRes.error;
    if (goalsRes.error) throw goalsRes.error;
    if (budgetRes.error) throw budgetRes.error;

    setTransactions(txRes.data || []);
    setGoals(goalsRes.data || []);
    setBudget(budgetRes.data || null);
    setLoading(false);
  }, [configured, user]);

  useEffect(() => {
    if (user) refresh();
    if (!user) {
      setTransactions([]);
      setGoals([]);
      setBudget(null);
    }
  }, [refresh, user]);

  const value = useMemo(
    () => ({
      transactions,
      goals,
      budget,
      loading,
      refresh,
      saveTransaction: async (payload, id) => {
        const row = { ...payload, user_id: user.id, amount: Number(payload.amount) };
        const result = id
          ? await supabase.from('transactions').update(row).eq('id', id).eq('user_id', user.id)
          : await supabase.from('transactions').insert(row);
        if (result.error) throw result.error;
        await refresh();
      },
      deleteTransaction: async (id) => {
        const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
        if (error) throw error;
        await refresh();
      },
      saveGoal: async (payload, id) => {
        const row = {
          ...payload,
          user_id: user.id,
          target_amount: Number(payload.target_amount),
          saved_amount: Number(payload.saved_amount),
        };
        const result = id
          ? await supabase.from('savings_goals').update(row).eq('id', id).eq('user_id', user.id)
          : await supabase.from('savings_goals').insert(row);
        if (result.error) throw result.error;
        await refresh();
      },
      deleteGoal: async (id) => {
        const { error } = await supabase.from('savings_goals').delete().eq('id', id).eq('user_id', user.id);
        if (error) throw error;
        await refresh();
      },
      saveBudget: async (monthlyLimit) => {
        const { error } = await supabase.from('budgets').upsert(
          { user_id: user.id, monthly_limit: Number(monthlyLimit || 0) },
          { onConflict: 'user_id' },
        );
        if (error) throw error;
        await refresh();
      },
    }),
    [budget, goals, loading, refresh, transactions, user],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  return useContext(FinanceContext);
}
