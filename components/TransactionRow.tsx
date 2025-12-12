'use client';

import { Transaction } from '@/types/transaction';
import { useState, useEffect, useRef } from 'react'
interface Props {
    trans: Transaction;
    isMenuOpen: boolean;
    toggleMenu: () => void;
    onCloseMenu: () => void;
    onEdit: (tx: Transaction) => void;
    onDelete: (id: string) => void;
}

export default function TransactionRow({ trans, toggleMenu, isMenuOpen, onCloseMenu, onEdit, onDelete }: Props) {

    const handleAction = (action: 'edit' | 'delete') => {
        onCloseMenu();
        if (action === 'edit') onEdit(trans);
        if (action === 'delete') onDelete(trans.id);
    };

    return (
        <tr className="h-14 text-center odd:bg-white even:bg-gray-100" key={trans.id}>
            <td>{trans.date}</td>
            <td>Категории            {/*${categories[trans.category]*/} </td>
            <td >{trans.description}</td>
            <td >{trans.type}</td>
            <td>{trans.type == "expense" ? '- ' + trans.amount : '+ ' + trans.amount} BYN</td>

            <td className="w-4 pr-10 relative text-right">
                <button type="button" className="text-xl font-bold p-1 hover:bg-gray-200 rounded-full"
                    data-menu-target={trans.id} onClick={toggleMenu}>⋮</button>

                <div id="menu-{trans.id}"
                    className={`absolute right-8 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 
                        ${isMenuOpen ? '' : 'hidden'}`}
                    data-trans-id={trans.id}>
                    <button type="button"
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 edit-trans-btn"
                        data-id={trans.id} onClick={()=>handleAction('edit')}>Редактировать</button>
                    <button type="button"
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 delete-trans-btn"
                        data-id={trans.id} onClick={()=>handleAction('delete')}>Удалить </button>
                </div>
            </td>
        </tr>
    );
}