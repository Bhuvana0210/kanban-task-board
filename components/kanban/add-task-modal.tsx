"use client"

import { useEffect, useState } from "react"
import type { Task, TaskStatus } from "./task-context"

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: { title: string; description: string; status: TaskStatus }) => void
  initialTask?: Pick<Task, "title" | "description" | "status">
  submitLabel?: string
  titleLabel?: string
}

const statuses: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "inprogress", label: "In Progress" },
  { key: "done", label: "Done" },
]

export function AddTaskModal({
  open,
  onClose,
  onSubmit,
  initialTask,
  submitLabel = "Add Task",
  titleLabel = "Add New Task",
}: Props) {
  const [title, setTitle] = useState(initialTask?.title ?? "")
  const [description, setDescription] = useState(initialTask?.description ?? "")
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status ?? "todo")

  useEffect(() => {
    if (open) {
      setTitle(initialTask?.title ?? "")
      setDescription(initialTask?.description ?? "")
      setStatus(initialTask?.status ?? "todo")
    }
  }, [open, initialTask])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center min-h-screen"
    >
      <div className="absolute inset-0 bg-foreground/10 dark:bg-foreground/20" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-lg border border-border bg-card p-4 shadow-lg">
        <h2 id="modal-title" className="mb-3 text-lg font-semibold text-foreground">
          {titleLabel}
        </h2>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!title.trim()) return
            onSubmit({ title: title.trim(), description: description.trim(), status })
            onClose()
          }}
        >
          <label className="text-sm text-muted-foreground">
            Title
            <input
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none ring-0 focus:border-ring"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Design login screen"
              required
            />
          </label>
          <label className="text-sm text-muted-foreground">
            Description
            <textarea
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Optional details..."
            />
          </label>
          <label className="text-sm text-muted-foreground">
            Status
            <select
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-ring"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              {statuses.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-md border border-border bg-transparent px-3 py-2 text-foreground hover:bg-accent"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:opacity-90">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
