import { Transaction, TransactionFormData } from '@/types/transaction';

class Api {
  static #baseUrl = 'http://localhost:5000';

  static async getAllTransactions() {
    const response = await fetch(`${Api.#baseUrl}/transactions`);
    return await response.json();
  }

  static async addTransaction(trans: TransactionFormData) {
    const response = await fetch(`${Api.#baseUrl}/transactions`, {
      method: 'POST',
      body: JSON.stringify(trans),
    });
    return await response.json();
  }

  static async editTransaction(trans: TransactionFormData) {
    const id = trans.id;

    if (!id) {
      throw new Error("Cannot update transaction without an ID.");
    }
    const response = await fetch(`${Api.#baseUrl}/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(trans),
    });

    return await response.json();
  }

  static async deleteTransaction(id: string) {
    const response = await fetch(`${Api.#baseUrl}/transactions/${id}`, {
      method: 'DELETE',
    });
    // может быть надо добавить возврат response.json
  }


}

export default Api;
