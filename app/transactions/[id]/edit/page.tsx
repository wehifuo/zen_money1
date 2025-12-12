'use client';
import { useState, useEffect } from 'react';
import Api from '@/server/api';
import TransactionForm from '@/components/TransactionForm'
import TransactionTable from '@/components/TransactionTable';
import { Transaction, TransactionFormData } from '@/types/transaction';
import { FormEvent, ChangeEvent } from 'react';

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        Api.getAllTransactions().then(setTransactions);
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
            <h1 className="text-4xl font-bold mt-8 mb-8 text-left">FinApp</h1>
            <div className="container mx-auto p-4">
                <div className="mb-10">
                    <TransactionForm
                        key={editingTransaction?.id || 'new'}
                        onSubmit={addOrEditTrans}
                        initialData={editingTransaction}
                        onCancel={() => {
                            setEditingTransaction(null);
                        }}
                    />
                    <p>прпрпрпрррррррррррррр</p>
                </div>
            </div>

        </main>
    );
}
