'use client';

import { Transaction, TransactionFormData } from '@/types/transaction';
import { FormEvent} from 'react';

interface Props {
    onSubmit: (data: TransactionFormData) => void;
    initialData?: Transaction | null;
    onCancel: () => void;
}

export default function TransactionForm({ onSubmit, initialData, onCancel }: Props) {
    const isEditing = !!initialData;


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const transaction: TransactionFormData = {
            amount: Number(formData.get('sum')),
            date: formData.get('date') as string,
            description: (formData.get('description') as string) || '',
            category: (formData.get('categorie') as string) || '',
            type: formData.get('type-transaction') as 'income' | 'expense',
        };

        if (isEditing && initialData.id) {
            const transactionToUpdate: TransactionFormData = {
                ...transaction,
                id: initialData.id,
            };
            onSubmit(transactionToUpdate);
        } else {
            onSubmit(transaction);
        }

        if (!initialData) {
            e.currentTarget.reset();
        }
    };



    return (
        <form
            id="creat_transaction"
            className="flex flex-col gap-5 bg-gray-100 rounded-lg p-5"
            onSubmit={handleSubmit}
        >
            <h2 id="title" className="text-xl font-bold">
                {isEditing ? 'Редактировать операцию' : 'Новая операция'}
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col flex-1 gap-1">
                    <p>Сумма</p>
                    <input
                        name="sum"
                        id="sum_input"
                        type="number"
                        step="0.01"
                        defaultValue={initialData?.amount ?? ''}
                        placeholder="0.00"
                        required
                        className="h-10 w-full p-3 border border-gray-400 rounded-lg"
                    />
                </div>

                <div className="flex flex-col flex-1 gap-1">
                    <p>Дата</p>
                    <input
                        name="date"
                        type="date"
                        id="date_input"
                        defaultValue={initialData?.date ?? new Date().toISOString().split('T')[0]}
                        required
                        className="h-10 w-full p-3 border border-gray-400 rounded-lg"
                    />
                </div>

                <div className="flex flex-col flex-1 gap-1">
                    <p>Категория</p>
                    <input
                        name="categorie"
                        type="categorie_input"
                        defaultValue={initialData?.category ?? ''}
                        placeholder="Продукты, подарки..."
                        required
                        className="h-10 w-full p-3 border border-gray-400 rounded-lg"
                    />
                </div>

                <div className="flex flex-col flex-1 gap-1">
                    <p>Тип</p>
                    <select
                        name="type-transaction"
                        defaultValue={initialData?.type ?? 'income'}
                        className="h-10 p-2 border border-gray-300 rounded-lg"
                    >
                        <option value="income">Доход</option>
                        <option value="expense">Расход</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col">
                <p className="mb-2">Описание</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <input
                        name="description"
                        type="description_input"
                        defaultValue={initialData?.description ?? ''}
                        placeholder="Краткое описание..."
                        className="h-10 p-3 flex-1 border border-gray-400 rounded-lg"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="p-2 bg-amber-400 hover:bg-amber-300 border border-gray-200 rounded-lg font-medium"
                        >
                            {isEditing ? 'Сохранить' : 'Добавить'}
                        </button>

                        {isEditing && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
                            >
                                Отмена
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}