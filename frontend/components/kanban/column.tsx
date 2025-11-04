/**
 * Column Component
 *
 * Represents a draggable column in the Kanban board with a specific task status.
 * Uses @dnd-kit/core's useDroppable hook to provide a droppable area for drag-and-drop operations.
 * Shows the column title and count of tasks, and visually changes when a draggable is hovered over.
 * Renders child task cards that belong to this status.
 * Includes accessible labels for assistive technology users.
 */

"use client"
import { useDroppable } from "@dnd-kit/core"
import type { Task, TaskStatus } from "./task-context"
import { TaskCard } from "./task-card"

const titles: Record<TaskStatus, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
}

export function Column({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  })

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">{titles[status]}</h2>
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{tasks.length}</span>
      </header>

      <div
        ref={setNodeRef}
        className={`min-h-24 rounded-lg border border-dashed p-2 ${
          isOver ? "border-ring bg-accent/50" : "border-border"
        }`}
        aria-label={`${titles[status]} column dropzone`}
      >
        <div className="flex flex-col gap-2">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
