/**
 * Header Component
 *
 * This React functional component renders the header area of the Kanban Task Board app.
 *
 * Features:
 * - Displays the app title prominently.
 * - Provides a search input to filter tasks by keyword, which updates shared filterQuery state.
 * - Includes a theme toggle button to switch between light and dark modes, which updates shared theme state.
 * - Contains an "Add Task" button that opens a modal for creating new tasks.
 * - Renders two search inputs: one visible on larger screens and one for mobile devices, both updating the filterQuery.
 * - Uses accessible attributes like aria-label and title for screen reader and tooltip support.
 * - Manages local modal open/close state for showing/hiding the AddTaskModal component.
 * - Integrates with shared task context to add new tasks and update task filtering and theme.
 *
 * This component enhances UX by letting users quickly search, switch themes,
 * and add tasks from a consistent top bar across device sizes.
 */

"use client"

import { useState } from "react"
import { Plus, Moon, Sun } from "lucide-react"
import { useTasks } from "./task-context"
import { AddTaskModal } from "./add-task-modal"

export function Header() {
  const { setFilterQuery, addTask, theme, toggleTheme } = useTasks()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-balance text-xl font-semibold text-foreground md:text-2xl">Kanban Task Board</h1>
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search tasks..."
            className="hidden w-52 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring md:block"
            onChange={(e) => setFilterQuery(e.target.value)}
            aria-label="Search tasks"
          />
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-accent"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Add Task</span>
            <span className="md:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="mx-auto block max-w-6xl px-4 pb-3 md:hidden">
        <input
          type="search"
          placeholder="Search tasks..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
          onChange={(e) => setFilterQuery(e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      <AddTaskModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => addTask({ ...data })}
        submitLabel="Add Task"
        titleLabel="Add New Task"
      />
    </header>
  )
}
