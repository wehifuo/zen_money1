'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Api from '@/server/api';
import TransactionForm from '@/components/TransactionForm'
import TransactionTable from '@/components/TransactionTable';
import { Transaction, Categorie} from '@/types/transaction';
import { FormEvent, ChangeEvent } from 'react';

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Categorie[]>([]);

    useEffect(() => {
        Api.getAllTransactions().then(setTransactions);
        Api.getAllCategories().then(setCategories);
    }, []);

    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);


    const deleteTransaction = async (id: string) => {
        await Api.deleteTransaction(id);
        setTransactions(transactions.filter(tx => tx.id !== id));
    };

    return (
        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-row justify-between items-center">
                <Link href="/transactions" className="text-4xl font-bold mt-8 mb-8 text-left">FinApp</Link>
                    <Link  href="/transactions/create" 
                    className="flex items-center bg-amber-400 hover:bg-amber-300 h-15 text-gray-900 border border-amber-500 rounded-lg py-1 px-3 sm:py-2 sm:px-6" >
                        + Добавить транзакцию</Link>
            </div>
            <div className="container mx-auto p-4">
                {/* <div className="mb-10">
                    <TransactionForm
                        key={editingTransaction?.id || 'new'}
                        onSubmit={addOrEditTrans}
                        initialData={editingTransaction}
                        onCancel={() => {
                            setEditingTransaction(null);
                        }}
                    />
                </div> */}
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
