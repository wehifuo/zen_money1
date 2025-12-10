import Link from 'next/link'
import { users } from '../../../user-data'
import { notFound } from 'next/navigation'

export default async function UserPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const user = users.find((user) => user.id === id)
  if (!user) {
    return notFound()
  }
  return (
    <div className="flex flex-col gap-2">
      <Link href={`/users/${user.id}/edit`}>Edit</Link>
      User: {user.name}
      <Link href="/users">Back to users</Link>
    </div>
  )
}
