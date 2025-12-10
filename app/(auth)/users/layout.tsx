import { users } from '../../user-data'
import Link from 'next/link'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex gap-4 justify-between">
      <div className="flex flex-col gap-2 w-1/4">
        {users.map((user) => (
          <div key={user.id} className="text-2xl font-bold border-b border-gray-300 p-2">
            <Link href={`/users/${user.id}`}>{user.name}</Link>
          </div>
        ))}
      </div>
      <div className="grow">{children}</div>
    </div>
  )
}
