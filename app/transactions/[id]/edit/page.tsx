'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Api, { ApiError } from '@/server/api';
import AppHeader from '@/components/AppHeader';
import TransactionForm from '@/components/TransactionForm';
import { Categorie, Transaction, TransactionFormData } from '@/types/transaction';

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    Promise.all([Api.getTransaction(id), Api.getAllCategories()])
      .then(([transactionData, categoriesData]) => {
        if (cancelled) {
          return;
        }

        setTransaction(transactionData);
        setCategories(categoriesData);
      })
      .catch((loadError: unknown) => {
        if (cancelled) {
          return;
        }

        if (loadError instanceof ApiError && loadError.status === 404) {
          setNotFound(true);
          return;
        }

        setError(
          loadError instanceof Error ? loadError.message : 'Не удалось загрузить транзакцию',
        );
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const saveTransaction = async (data: TransactionFormData) => {
    await Api.editTransaction(data);
    router.push('/transactions');
  };

  const cancel = () => router.push('/transactions');

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <AppHeader>
        <Link href="/transactions" className="text-amber-600 hover:text-amber-500 font-medium">
          ← К списку операций
        </Link>
      </AppHeader>

      <div className="container mx-auto p-4">
        {isLoading && <p className="text-gray-600">Загрузка…</p>}

        {!isLoading && notFound && (
          <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            Транзакция не найдена.{' '}
            <Link href="/transactions" className="underline">
              Вернуться к списку
            </Link>
          </div>
        )}

        {!isLoading && error && (
          <div
            role="alert"
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700"
          >
            {error}
          </div>
        )}

        {!isLoading && transaction && (
          <TransactionForm
            key={transaction.id}
            categories={categories}
            onCategoryCreated={(cat) =>
              setCategories((prev) =>
                prev.some((category) => category.id === cat.id) ? prev : [...prev, cat],
              )
            }
            onSubmit={saveTransaction}
            initialData={transaction}
            onCancel={cancel}
          />
        )}
      </div>
    </main>
  );
}
