'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Api from '@/server/api';
import AppHeader from '@/components/AppHeader';
import TransactionForm from '@/components/TransactionForm';
import { Categorie, TransactionFormData } from '@/types/transaction';

export default function CreateTransactionPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    Api.getAllCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : 'Не удалось загрузить категории',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const addTransaction = async (transaction: TransactionFormData) => {
    await Api.addTransaction(transaction);
    router.push('/transactions');
  };

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <AppHeader>
        <Link href="/transactions" className="text-amber-600 hover:text-amber-500 font-medium">
          ← К списку операций
        </Link>
      </AppHeader>

      <div className="container mx-auto p-4">
        {loadError && (
          <p role="alert" className="mb-4 text-red-600">
            {loadError}
          </p>
        )}

        <TransactionForm
          categories={categories}
          onCategoryCreated={(cat) =>
            setCategories((prev) =>
              prev.some((category) => category.id === cat.id) ? prev : [...prev, cat],
            )
          }
          onSubmit={addTransaction}
          onCancel={() => router.push('/transactions')}
        />
      </div>
    </main>
  );
}
