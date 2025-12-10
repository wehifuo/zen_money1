"use client";
import Link from 'next/link'
import {useState, useEffect}  from "react"
import type { Transaction } from "@/types/transaction.ts";
import Api from "@/server/api";



export default function Home() {
  const [todos, setTodos] = useState<Transaction[]>([])

  useEffect(() => {
    console.log("Enter useEffect")
    Api.getTodos().then(setTodos)
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="text-white">
        Добро пожаловать в сервис для упарвления финансами
        <div className="flex flex-row">
        <Link className="text-blue-500 p-10" href="/transactions">
          Транзакции
        </Link>
        <Link className="text-blue-500 p-10" href="/users">
          Добавить транзакцию
        </Link>
      </div>

      </main>
    </div>
  )
}
