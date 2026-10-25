import { Categorie, Transaction, TransactionFormData } from '@/types/transaction';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    });
  } catch {
    throw new ApiError('Не удалось подключиться к серверу. Запущен ли json-server?');
  }

  if (!response.ok) {
    throw new ApiError(
      response.status === 404 ? 'Запись не найдена' : `Ошибка запроса (${response.status})`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

class Api {
  static getAllTransactions(): Promise<Transaction[]> {
    return request<Transaction[]>('/transactions');
  }

  static getTransaction(id: string): Promise<Transaction> {
    return request<Transaction>(`/transactions/${id}`);
  }

  static addTransaction(trans: TransactionFormData): Promise<Transaction> {
    const data = { ...trans };
    delete data.id;

    return request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static editTransaction(trans: TransactionFormData): Promise<Transaction> {
    const id = trans.id;

    if (!id) {
      throw new ApiError('Нельзя обновить транзакцию без ID.');
    }

    const data = { ...trans };
    delete data.id;

    return request<Transaction>(`/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deleteTransaction(id: string): Promise<void> {
    await request<unknown>(`/transactions/${id}`, { method: 'DELETE' });
  }

  static getAllCategories(): Promise<Categorie[]> {
    return request<Categorie[]>('/categories');
  }

  static addCategorie(name: string): Promise<Categorie> {
    return request<Categorie>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }
}

export default Api;
