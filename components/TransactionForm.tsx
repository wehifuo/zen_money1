'use client';

import { FormEvent, useRef, useState } from 'react';
import Api from '@/server/api';
import { Categorie, Transaction, TransactionFormData } from '@/types/transaction';
import { formatAmount, getTodayISO } from '@/lib/format';

interface Props {
  onSubmit: (data: TransactionFormData) => Promise<void> | void;
  categories: Categorie[];
  initialData?: Transaction | null;
  onCategoryCreated: (cat: Categorie) => void;
  onCancel: () => void;
}

export default function TransactionForm({
  onSubmit,
  onCategoryCreated,
  categories,
  initialData,
  onCancel,
}: Props) {
  const isEditing = !!initialData;
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = getTodayISO();
  const initialCategoryName = initialData
    ? (categories.find((cat) => cat.id === initialData.category)?.name ?? '')
    : '';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrors({});
    setSubmitError('');

    const data = new FormData(e.currentTarget);
    const fieldErrors: Record<string, string> = {};

    const rawAmount = String(data.get('sum') ?? '')
      .trim()
      .replace(',', '.');

    if (!rawAmount) {
      fieldErrors.amount = 'Укажите сумму';
    } else if (!/^\d+(\.\d{1,2})?$/.test(rawAmount)) {
      fieldErrors.amount = 'Введите число с максимум двумя знаками после запятой';
    } else if (Number(rawAmount) <= 0) {
      fieldErrors.amount = 'Сумма должна быть больше 0';
    }

    const date = String(data.get('date') ?? '');

    if (!date) {
      fieldErrors.date = 'Выберите дату';
    } else if (date > today) {
      fieldErrors.date = 'Дата не может быть в будущем';
    }

    const categoryName = String(data.get('categorie') ?? '').trim();

    if (!categoryName) {
      fieldErrors.category = 'Укажите категорию';
    }

    const type = data.get('type-transaction');

    if (type !== 'income' && type !== 'expense') {
      fieldErrors.type = 'Выберите тип операции';
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const existingCategory = categories.find(
        (cat) => cat.name.trim().toLowerCase() === categoryName.toLowerCase(),
      );

      let categoryId = existingCategory?.id;

      if (!categoryId) {
        const newCategory = await Api.addCategorie(categoryName);
        categoryId = newCategory.id;

        if (categoryId) {
          onCategoryCreated(newCategory);
        }
      }

      if (!categoryId) {
        throw new Error('Не удалось создать категорию');
      }

      const transaction: TransactionFormData = {
        amount: Math.round(Number(rawAmount) * 100) / 100,
        date,
        description: String(data.get('description') ?? '').trim(),
        category: categoryId,
        type: type as 'income' | 'expense',
      };

      if (isEditing && initialData.id) {
        await onSubmit({ ...transaction, id: initialData.id });
      } else {
        await onSubmit(transaction);
      }

      if (!isEditing) {
        formRef.current?.reset();
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Не удалось сохранить транзакцию',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      id="create_transaction"
      className="flex flex-col gap-5 bg-gray-100 rounded-lg p-5"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="text-xl font-bold">
        {isEditing ? 'Редактировать операцию' : 'Новая операция'}
      </h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1 gap-1">
          <label htmlFor="sum_input">Сумма</label>
          <input
            name="sum"
            id="sum_input"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            defaultValue={initialData ? formatAmount(initialData.amount).replace(/\s/g, '') : ''}
            placeholder="0.00"
            required
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? 'sum_error' : undefined}
            className={`h-10 w-full p-3 border rounded-lg ${
              errors.amount
                ? 'border-red-500 bg-red-50'
                : 'border-gray-400 focus:border-amber-400'
            }`}
          />
          {errors.amount && (
            <p id="sum_error" className="text-sm text-red-600">
              {errors.amount}
            </p>
          )}
        </div>

        <div className="flex flex-col flex-1 gap-1">
          <label htmlFor="date_input">Дата</label>
          <input
            name="date"
            type="date"
            id="date_input"
            defaultValue={initialData?.date ?? today}
            max={today}
            required
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? 'date_error' : undefined}
            className={`h-10 w-full p-3 border rounded-lg ${
              errors.date ? 'border-red-500 bg-red-50' : 'border-gray-400 focus:border-amber-400'
            }`}
          />
          {errors.date && (
            <p id="date_error" className="text-sm text-red-600">
              {errors.date}
            </p>
          )}
        </div>

        <div className="flex flex-col flex-1 gap-1">
          <label htmlFor="categorie_input">Категория</label>
          <input
            name="categorie"
            id="categorie_input"
            type="text"
            autoComplete="off"
            defaultValue={initialCategoryName}
            placeholder="Продукты, подарки..."
            required
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? 'categorie_error' : undefined}
            className={`h-10 w-full p-3 border rounded-lg ${
              errors.category
                ? 'border-red-500 bg-red-50'
                : 'border-gray-400 focus:border-amber-400'
            }`}
          />
          {errors.category && (
            <p id="categorie_error" className="text-sm text-red-600">
              {errors.category}
            </p>
          )}
        </div>

        <div className="flex flex-col flex-1 gap-1">
          <label htmlFor="type_input">Тип</label>
          <select
            name="type-transaction"
            id="type_input"
            defaultValue={initialData?.type ?? 'income'}
            aria-invalid={!!errors.type}
            aria-describedby={errors.type ? 'type_error' : undefined}
            className="h-10 p-2 border border-gray-300 rounded-lg"
          >
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
          {errors.type && (
            <p id="type_error" className="text-sm text-red-600">
              {errors.type}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="description_input" className="mb-2">
          Описание
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            name="description"
            id="description_input"
            type="text"
            autoComplete="off"
            defaultValue={initialData?.description ?? ''}
            placeholder="Краткое описание..."
            className="h-10 p-3 flex-1 border border-gray-400 rounded-lg"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="p-2 bg-amber-400 hover:bg-amber-300 border border-gray-200 rounded-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Сохранение…' : isEditing ? 'Сохранить' : 'Добавить'}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="p-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg disabled:opacity-60"
              >
                Отмена
              </button>
            )}
          </div>
        </div>
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}
    </form>
  );
}
