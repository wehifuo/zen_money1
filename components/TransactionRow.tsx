'use client';

import { Transaction } from '@/types/transaction';
import { formatDate, formatSignedAmount, TRANSACTION_TYPE_LABELS } from '@/lib/format';

interface Props {
  trans: Transaction;
  categoryName: string;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  onCloseMenu: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionRow({
  trans,
  categoryName,
  toggleMenu,
  isMenuOpen,
  onCloseMenu,
  onEdit,
  onDelete,
}: Props) {
  const handleAction = (action: 'edit' | 'delete') => {
    onCloseMenu();

    if (action === 'edit') {
      onEdit(trans);
      return;
    }

    onDelete(trans.id);
  };

  return (
    <tr className="h-14 text-center odd:bg-white even:bg-gray-100">
      <td>{formatDate(trans.date)}</td>
      <td>{categoryName}</td>
      <td>{trans.description}</td>
      <td>{TRANSACTION_TYPE_LABELS[trans.type]}</td>
      <td
        className={
          trans.type === 'expense' ? 'font-medium text-red-600' : 'font-medium text-green-600'
        }
      >
        {formatSignedAmount(trans.amount, trans.type)}
      </td>

      <td className="w-4 pr-10 relative text-right" data-menu-root={trans.id}>
        <button
          type="button"
          className="text-xl font-bold p-1 hover:bg-gray-200 rounded-full"
          aria-label={`Действия с транзакцией от ${formatDate(trans.date)}`}
          aria-expanded={isMenuOpen}
          aria-controls={`menu-${trans.id}`}
          onClick={toggleMenu}
        >
          ⋮
        </button>

        <div
          id={`menu-${trans.id}`}
          className={`absolute right-0 top-full w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 ${
            isMenuOpen ? '' : 'hidden'
          }`}
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleAction('edit')}
          >
            Редактировать
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={() => handleAction('delete')}
          >
            Удалить
          </button>
        </div>
      </td>
    </tr>
  );
}
