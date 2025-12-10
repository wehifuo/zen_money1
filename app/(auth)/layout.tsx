import Link from 'next/link'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header>
        <nav className="text-2xl font-bold flex gap-4">
          <Link href="/">Main page</Link>
          <span>ffff</span>
          <span>ggggg</span>
        </nav>
      </header>
      {children}
    </>
  )
}
