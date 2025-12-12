// types/transaction.ts
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  type: 'income' | 'expense';
}

export interface Categorie {
  id?: string;
  name: string;
}

export type TransactionFormData = Omit<Transaction, 'id'> & { id?: string };
