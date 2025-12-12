'use client';
import { useState, useEffect } from 'react';
import Api from '@/server/api';
import TransactionForm from '@/components/TransactionForm'
import TransactionTable from '@/components/TransactionTable';
import { Transaction, TransactionFormData, Categorie } from '@/types/transaction';
import Link from 'next/link'


export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Categorie[]>([]);
    

    useEffect(() => {
        Api.getAllTransactions().then(setTransactions);
        Api.getAllCategories().then(setCategories);
    }, []);

    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const addOrEditTrans = async (transactionData: TransactionFormData) => {

        if (editingTransaction) {
            const updated = await Api.editTransaction(transactionData);
            setTransactions(prev =>
                prev.map(t => (t.id === updated.id ? updated : t))
            );
            setEditingTransaction(null);
        } else {
            const newTrans = await Api.addTransaction(transactionData);
            setTransactions(prev => [...prev, newTrans]);
        }
    };

    const deleteTransaction = async (id: string) => {
        await Api.deleteTransaction(id);
        setTransactions(transactions.filter(tx => tx.id !== id));
    };

    return (
        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <Link href="/transactions" className="text-4xl font-bold mt-8 mb-8 text-left">FinApp</Link>
            <div className="container mx-auto p-4">
                <div className="mb-10">
                    <TransactionForm
                        key={editingTransaction?.id || 'new'}
                        onCategoryCreated={(cat) => setCategories(prev => [...prev, cat])}
                        categories={categories}
                        onSubmit={addOrEditTrans}
                        initialData={editingTransaction}
                        onCancel={() => {
                            setEditingTransaction(null);
                        }}
                    />
                </div>
                <TransactionTable
                    categories={categories}
                    transactions={transactions}
                    onEdit={setEditingTransaction}
                    onDelete={deleteTransaction}
                />
            </div>

        </main>
    );
}
