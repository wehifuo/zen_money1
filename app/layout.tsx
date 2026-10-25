import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinApp — учёт личных финансов',
  description: 'Учёт доходов и расходов: список операций, категории, поиск и фильтры.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
