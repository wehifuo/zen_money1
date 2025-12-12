'use client';

import TransactionRow from './TransactionRow';
import { Transaction } from '@/types/transaction';
import { useState } from 'react'

interface Props {
    transactions: Transaction[];
    onEdit: (trans: Transaction) => void;
    onDelete: (id: string) => void;
}

export default function TransactionTable({ transactions, onEdit, onDelete }: Props) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const handleMenuToggle = (id: string) => {
        setOpenMenuId(prev => prev === id ? null : id);
    };

    const handleCloseMenu = () => setOpenMenuId(null);

    return (

        <table className="rounded-2xl gap-3 w-full">
            <thead className="h-10 bg-gray-300 rounded-2xl ">
                <tr className="h-15 text-center">
                    <td className="w-24">
                        {' '}
                        <button type="button" id="date-sort">
                            Дата
                        </button>
                    </td>
                    <td className="w-28">Категория</td>
                    <td className="w-auto">Описание</td>
                    <td className="w-28">Тип</td>
                    <td className="w-32">
                        <button type="button" id="sum-sort">
                            Сумма
                        </button>
                    </td>
                    <td className="w-4 pr-10"></td>
                </tr>
            </thead>
            <tbody>
                {transactions.map(trans => (
                    <TransactionRow
                        key={trans.id}
                        trans={trans}
                        isMenuOpen={openMenuId === trans.id}
                        toggleMenu={() => handleMenuToggle(trans.id)}
                        onCloseMenu={handleCloseMenu}
                        onEdit={onEdit}
                        onDelete={onDelete}


                    />
                ))}
            </tbody>
        </table>

    );
}