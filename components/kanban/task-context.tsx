"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type TaskStatus = "todo" | "inprogress" | "done"

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  createdAt: number
  updatedAt: number
}

type TaskContextValue = {
  tasks: Task[]
  filterQuery: string
  setFilterQuery: (q: string) => void
  addTask: (input: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  editTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void
  deleteTask: (id: string) => void
  moveTaskToStatus: (id: string, status: TaskStatus) => void
  theme: "light" | "dark"
  toggleTheme: () => void
}

const TaskContext = createContext<TaskContextValue | null>(null)

const TASKS_KEY = "kanban_tasks_v1"
const THEME_KEY = "kanban_theme_v1"

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filterQuery, setFilterQuery] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Load tasks
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TASKS_KEY)
      if (raw) {
        const parsed: Task[] = JSON.parse(raw)
        setTasks(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  // Persist tasks
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    } catch {
      // ignore
    }
  }, [tasks])

  // Theme load/apply
  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as "light" | "dark" | null) || null
    const initial =
      saved ?? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    setTheme(initial)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  const addTask = useCallback((input: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const now = Date.now()
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${now}-${Math.random().toString(36).slice(2)}`
    const task: Task = { id, createdAt: now, updatedAt: now, ...input }
    setTasks((prev) => [task, ...prev])
  }, [])

  const editTask = useCallback((id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t)))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const moveTaskToStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status, updatedAt: Date.now() } : t)))
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"))
  }, [])

  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      filterQuery,
      setFilterQuery,
      addTask,
      editTask,
      deleteTask,
      moveTaskToStatus,
      theme,
      toggleTheme,
    }),
    [tasks, filterQuery, addTask, editTask, deleteTask, moveTaskToStatus, theme, toggleTheme],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error("useTasks must be used within TaskProvider")
  return ctx
}
