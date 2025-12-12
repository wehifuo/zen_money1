'use client';

import TransactionRow from './TransactionRow';
import { Categorie, Transaction } from '@/types/transaction';
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';

interface Props {
    transactions: Transaction[];
    categories: Categorie[];
    onEdit: (trans: Transaction) => void;
    onDelete: (id: string) => void;
}

export default function TransactionTable({ transactions, categories, onEdit, onDelete }: Props) {

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedType, setSelectedType] = useState<'income' | 'expense' | ''>('');

    const handleMenuToggle = (id: string) => {
        setOpenMenuId(prev => prev === id ? null : id);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    const handleCloseMenu = () => setOpenMenuId(null);

    const { filteredTransactions, totalPages } = useMemo(() => {
        let filtered = transactions;

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((t) =>
                t.description?.toLowerCase().includes(query)
            );
        }

        // 2. Фильтр по категории
        if (selectedCategory) {
            filtered = filtered.filter((t) => t.category === selectedCategory);
        }

        // 3. Фильтр по типу (income / expense)
        if (selectedType) {
            filtered = filtered.filter((t) => t.type === selectedType);
        }

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginated = filtered.slice(start, end);

        return { filteredTransactions: paginated, totalPages, totalItems };
    }, [transactions,
        searchTerm,
        selectedCategory,
        selectedType,
        currentPage,
        itemsPerPage,]);


    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };



    return (

        <div className="flex flex-col gap-5 bg-gray-100 rounded-lg mx-auto my-10 p-5">
            <h2 className="text-xl font-bold">История операций</h2>
            <div className="flex flex-wrap items-center gap-2">
                <input type="text" placeholder="Поиск" id="search" className="h-10 flex-1 min-w-[150px] p-3 border border-gray-400 rounded-lg"
                    onChange={(e) => setSearchTerm(e.target.value)} />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-10 px-3 border border-gray-300 rounded-lg min-w-[140px]"
                >
                    <option value="">Категории</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as 'income' | 'expense' | '')}
                    className="h-10 px-3 border border-gray-300 rounded-lg min-w-[120px]"
                >
                    <option value="">Tипы</option>
                    <option value="income">Доход</option>
                    <option value="expense">Расход</option>
                </select>
            </div>
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
                    {filteredTransactions.map(trans => (

                        <TransactionRow
                            key={trans.id}
                            trans={trans}
                            categorie={categories.find(category => category.id === trans.category)?.name || ''}
                            isMenuOpen={openMenuId === trans.id}
                            toggleMenu={() => handleMenuToggle(trans.id)}
                            onCloseMenu={handleCloseMenu}
                            onEdit={onEdit}
                            onDelete={onDelete}


                        />
                    ))}
                </tbody>
            </table>

            {(
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Показывать по:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="h-10 p-2 border border-gray-300 rounded-lg w-full sm:w-auto"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition"
                        >
                            ← Назад
                        </button>

                        {getPageNumbers().map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === page
                                    ? 'bg-amber-400 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition"
                        >
                            Вперед →
                        </button>
                    </div>
                </div>
            )}

        </div>

    );
}