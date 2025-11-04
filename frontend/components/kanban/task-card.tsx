/**
 * TaskCard Component
 *
 * Represents a single draggable task card in the Kanban board.
 * 
 * Integrates dnd-kit useDraggable for drag-and-drop support with dynamic transform and opacity styles.
 * Shows task title, description (or placeholder), and action buttons for editing, deleting, and dragging.
 * Uses local state to toggle the edit modal, which allows updating task details.
 * Integrates with shared task context to perform delete and edit actions.
 * Includes accessible labels and UI transitions to enhance UX.
 */

"use client"

import type React from "react"
import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { GripVertical, Pencil, Trash2 } from "lucide-react"
import type { Task } from "./task-context"
import { useTasks } from "./task-context"
import { AddTaskModal } from "./add-task-modal"

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.8 : 1,
  } as React.CSSProperties

  const { deleteTask, editTask } = useTasks()
  const [openEdit, setOpenEdit] = useState(false)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow"
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-pretty text-sm font-semibold text-foreground">{task.title}</h3>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="rounded-md p-1 hover:bg-accent" aria-label="Edit task" onClick={() => setOpenEdit(true)}>
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            className="rounded-md p-1 hover:bg-accent"
            aria-label="Delete task"
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
          <button className="rounded-md p-1 hover:bg-accent" aria-label="Drag handle" {...listeners} {...attributes}>
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
      {task.description ? (
        <p className="text-sm leading-6 text-muted-foreground">{task.description}</p>
      ) : (
        <p className="text-sm italic text-muted-foreground">No description</p>
      )}

      <AddTaskModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        initialTask={{
          title: task.title,
          description: task.description,
          status: task.status,
        }}
        onSubmit={(data) => editTask(task.id, data)}
        submitLabel="Save Changes"
        titleLabel="Edit Task"
      />
    </div>
  )
}
