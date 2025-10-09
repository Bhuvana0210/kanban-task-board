import { TaskProvider } from "@/components/kanban/task-context"
import { Header } from "@/components/kanban/header"
import { Board } from "@/components/kanban/board"

export default function Page() {
  return (
    <TaskProvider>
      <main className="min-h-[100dvh]">
        <Header />
        <Board />
      </main>
    </TaskProvider>
  )
}
