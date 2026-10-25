import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function AppHeader({ children }: Props) {
  return (
    <header className="flex flex-row justify-between items-center gap-4">
      <Link href="/transactions" className="text-4xl font-bold mt-8 mb-8 text-left">
        FinApp
      </Link>
      {children}
    </header>
  );
}
