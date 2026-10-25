'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Api from '@/server/api';
import AppHeader from './AppHeader';
import TransactionTable from './TransactionTable';
import { Categorie, Transaction } from '@/types/transaction';

export default function TransactionsView() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [transactionsData, categoriesData] = await Promise.all([
        Api.getAllTransactions(),
        Api.getAllCategories(),
      ]);

      setTransactions(transactionsData);
      setCategories(categoriesData);
      setError('');
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Не удалось загрузить данные',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const retry = () => {
    setIsLoading(true);
    setError('');
    void loadData();
  };

  const editTransaction = (transaction: Transaction) => {
    router.push(`/transactions/${transaction.id}/edit`);
  };

  const deleteTransaction = async (id: string) => {
    if (!window.confirm('Удалить эту транзакцию?')) {
      return;
    }

    try {
      await Api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
      setError('');
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Не удалось удалить транзакцию',
      );
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <AppHeader>
        <Link
          href="/transactions/create"
          className="flex items-center bg-amber-400 hover:bg-amber-300 h-15 text-gray-900 border border-amber-500 rounded-lg py-1 px-3 sm:py-2 sm:px-6"
        >
          + Добавить транзакцию
        </Link>
      </AppHeader>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={retry}
            className="rounded-lg border border-red-400 px-3 py-1 font-medium hover:bg-red-100"
          >
            Повторить
          </button>
        </div>
      )}

      <TransactionTable
        categories={categories}
        transactions={transactions}
        isLoading={isLoading}
        onEdit={editTransaction}
        onDelete={deleteTransaction}
      />
    </main>
  );
}
