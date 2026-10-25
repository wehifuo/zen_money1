'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import TransactionRow from './TransactionRow';
import { Categorie, Transaction } from '@/types/transaction';

interface Props {
  transactions: Transaction[];
  categories: Categorie[];
  isLoading?: boolean;
  onEdit: (trans: Transaction) => void;
  onDelete: (id: string) => void;
}

type SortField = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

export default function TransactionTable({
  transactions,
  categories,
  isLoading = false,
  onEdit,
  onDelete,
}: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'income' | 'expense' | ''>('');
  const [sort, setSort] = useState<{ field: SortField; direction: SortDirection } | null>(null);

  const handleMenuToggle = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleCloseMenu = () => setOpenMenuId(null);

  const resetPage = () => setCurrentPage(1);

  const toggleSort = (field: SortField) => {
    setSort((prev) =>
      prev?.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'desc' },
    );
    resetPage();
  };

  const getAriaSort = (field: SortField): 'ascending' | 'descending' | 'none' => {
    if (sort?.field !== field) {
      return 'none';
    }

    return sort.direction === 'asc' ? 'ascending' : 'descending';
  };

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const { rows, totalPages, page, totalItems } = useMemo(() => {
    let filtered = transactions;

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          (categoryNames.get(t.category) ?? '').toLowerCase().includes(query),
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    if (selectedType) {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    if (sort) {
      filtered = [...filtered].sort((a, b) => {
        const diff =
          sort.field === 'date' ? a.date.localeCompare(b.date) : a.amount - b.amount;

        return sort.direction === 'asc' ? diff : -diff;
      });
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Ограничиваем страницу при рендере: не вызываем setState из эффекта.
    const page = Math.min(currentPage, Math.max(totalPages, 1));
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return { rows: filtered.slice(start, end), totalPages, page, totalItems };
  }, [transactions, categoryNames, searchTerm, selectedCategory, selectedType, sort, currentPage, itemsPerPage]);

  const closeMenuOnOutsideClick = useCallback((event: PointerEvent) => {
    const target = event.target as HTMLElement | null;

    if (!target?.closest('[data-menu-root]')) {
      setOpenMenuId(null);
    }
  }, []);

  useEffect(() => {
    if (!openMenuId) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('pointerdown', closeMenuOnOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', closeMenuOnOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenuId, closeMenuOnOutsideClick]);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const columnCount = 6;

  return (
    <div className="flex flex-col gap-5 bg-gray-100 rounded-lg mx-auto my-10 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">История операций</h2>
        <span className="text-sm text-gray-600">Найдено: {totalItems}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          placeholder="Поиск по описанию или категории"
          id="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            resetPage();
          }}
          className="h-10 flex-1 min-w-[150px] p-3 border border-gray-400 rounded-lg"
        />

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            resetPage();
          }}
          className="h-10 px-3 border border-gray-300 rounded-lg min-w-[140px]"
          aria-label="Фильтр по категории"
        >
          <option value="">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value as 'income' | 'expense' | '');
            resetPage();
          }}
          className="h-10 px-3 border border-gray-300 rounded-lg min-w-[120px]"
          aria-label="Фильтр по типу"
        >
          <option value="">Все типы</option>
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>
      </div>

      <table className="rounded-2xl w-full">
        <thead className="h-10 bg-gray-300 rounded-2xl">
          <tr className="h-15 text-center">
            <th scope="col" className="w-24" aria-sort={getAriaSort('date')}>
              <button
                type="button"
                id="date-sort"
                className="inline-flex items-center gap-1"
                onClick={() => toggleSort('date')}
              >
                Дата
                {sort?.field === 'date' && <span aria-hidden="true">{sort.direction === 'asc' ? '↑' : '↓'}</span>}
              </button>
            </th>
            <th scope="col" className="w-28">Категория</th>
            <th scope="col" className="w-auto">Описание</th>
            <th scope="col" className="w-28">Тип</th>
            <th scope="col" className="w-32" aria-sort={getAriaSort('amount')}>
              <button
                type="button"
                id="sum-sort"
                className="inline-flex items-center gap-1"
                onClick={() => toggleSort('amount')}
              >
                Сумма
                {sort?.field === 'amount' && <span aria-hidden="true">{sort.direction === 'asc' ? '↑' : '↓'}</span>}
              </button>
            </th>
            <th scope="col" className="w-4 pr-10">
              <span className="sr-only">Действия</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={columnCount} className="py-6 text-gray-600">
                Загрузка…
              </td>
            </tr>
          )}

          {!isLoading && rows.length === 0 && (
            <tr>
              <td colSpan={columnCount} className="py-6 text-gray-600">
                Ничего не найдено
              </td>
            </tr>
          )}

          {!isLoading &&
            rows.map((trans) => (
              <TransactionRow
                key={trans.id}
                trans={trans}
                categoryName={categoryNames.get(trans.category) ?? ''}
                isMenuOpen={openMenuId === trans.id}
                toggleMenu={() => handleMenuToggle(trans.id)}
                onCloseMenu={handleCloseMenu}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
        </tbody>
      </table>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <div className="flex items-center gap-3">
          <label htmlFor="items-per-page" className="text-sm text-gray-600">
            Показывать по:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              resetPage();
            }}
            className="h-10 p-2 border border-gray-300 rounded-lg w-full sm:w-auto"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition"
          >
            ← Назад
          </button>

          {getPageNumbers().map((pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              aria-current={page === pageNumber ? 'page' : undefined}
              className={`w-10 h-10 rounded-lg font-medium transition ${
                page === pageNumber ? 'bg-amber-400 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50 hover:bg-gray-200 transition"
          >
            Вперед →
          </button>
        </div>
      </div>
    </div>
  );
}
