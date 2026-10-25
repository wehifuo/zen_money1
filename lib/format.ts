const amountFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const CURRENCY = 'BYN';

export function formatAmount(amount: number): string {
  return amountFormatter.format(amount);
}

export function formatSignedAmount(amount: number, type: 'income' | 'expense'): string {
  const sign = type === 'expense' ? '−' : '+';
  return `${sign} ${formatAmount(amount)} ${CURRENCY}`;
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');

  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}.${month}.${year}`;
}

// Локальная дата в формате YYYY-MM-DD (без сдвига из-за UTC).
export function getTodayISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export const TRANSACTION_TYPE_LABELS: Record<'income' | 'expense', string> = {
  income: 'Доход',
  expense: 'Расход',
};
