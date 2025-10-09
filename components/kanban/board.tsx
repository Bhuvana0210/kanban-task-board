"use client"

import { useMemo } from "react"
import { DndContext, type DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { useTasks, type TaskStatus } from "./task-context"
import { Column } from "./column"

export function Board() {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
  const { tasks, filterQuery, moveTaskToStatus } = useTasks()

  const filtered = useMemo(() => {
    const q = filterQuery.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
  }, [tasks, filterQuery])

  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, typeof filtered> = { todo: [], inprogress: [], done: [] }
    for (const t of filtered) map[t.status].push(t)
    return map
  }, [filtered])

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const destination = over.id as TaskStatus
    // Only update when dropped on a column
    if (destination === "todo" || destination === "inprogress" || destination === "done") {
      moveTaskToStatus(active.id as string, destination)
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-3">
        <Column status="todo" tasks={byStatus.todo} />
        <Column status="inprogress" tasks={byStatus.inprogress} />
        <Column status="done" tasks={byStatus.done} />
      </div>
    </DndContext>
  )
}
