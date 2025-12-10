import Link from 'next/link'
import { users } from '../../../../user-data'

export default async function XXX({ params }: { params: { id: string } }) {
  const { id } = await params
  const user = users.find((user) => user.id === id)
  if (!user) {
    return <div>User not found</div>
  }
  return (
    <div>
      <Link href="/users">Back to users</Link>
      <form className="flex flex-col gap-2">
        <input type="text" name="name" defaultValue={user.name} />
        <input type="text" name="phoneNumber" defaultValue={user.phoneNumber} />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
