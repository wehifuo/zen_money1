export type User = {
  id: string
  name: string
  phoneNumber: string
}

export const users: User[] = [
  { id: '123', name: 'Ivan', phoneNumber: '123123413' },
  { id: '456', name: 'Oleg', phoneNumber: '12312323123213' },
  { id: '789', name: 'Petr', phoneNumber: '123123413' },
]
