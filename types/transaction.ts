// types/transaction.ts
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  type: "income" | "expense";
}