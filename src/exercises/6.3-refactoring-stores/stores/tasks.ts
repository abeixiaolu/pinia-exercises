import { TodoTask } from '@/api/todos'
import { useLocalStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, skipHydrate, storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useTodosStore } from './todos'

// 🚨 Do not change the name of the store or the exported variables

export const useTasksStore = defineStore('6.3-tasks', () => {
  const todos = useTodosStore()
  const { list } = storeToRefs(todos)
  const finishedTasks = skipHydrate(useLocalStorage<TodoTask[]>('6.3-finishedTasks', []))
  const startedTasks = skipHydrate(
    useLocalStorage<Map<string, TodoTask>>('6.3-startedTasks', new Map(), {
      deep: true,
      serializer: {
        read: v => {
          try {
            return new Map(JSON.parse(v))
          } catch (_err) {
            return new Map()
          }
        },
        write: v => {
          try {
            return JSON.stringify(Array.from(v.entries()))
          } catch (_err) {
            return '[]'
          }
        },
      },
    }),
  )
  const activeTask = skipHydrate(
    useLocalStorage<TodoTask | null>('6.3-activeTask', null, {
      serializer: {
        read: v => {
          try {
            return JSON.parse(v)
          } catch (_err) {
            return null
          }
        },
        write: v => {
          try {
            return JSON.stringify(v)
          } catch (_err) {
            return 'null'
          }
        },
      },
    }),
  )

  function finishCurrentTodo() {
    if (!activeTask.value) {
      return
    }

    startedTasks.value.delete(activeTask.value.id)
    const todo = list.value.find(todo => todo.id === activeTask.value!.todoId)
    if (todo) {
      todo.finished = true
      const end = Date.now()
      finishedTasks.value.push({
        ...activeTask.value,
        end,
        totalTime: end - activeTask.value.createdAt,
      })
      activeTask.value = null
    }
  }

  const hasActiveTodo = computed<boolean>(() => !!activeTask.value)

  function startTodo(todoId: string) {
    const existingTodo = list.value.find(todo => todo.id === todoId)
    if (!existingTodo) {
      console.warn(`Todo with id ${todoId} does not exist`)
      return
    }
    if (existingTodo.finished) {
      console.warn(`Todo with id ${todoId} is already finished`)
      return
    }

    if (activeTask.value) {
      pauseCurrentTodo()
    }

    if (startedTasks.value.has(todoId)) {
      activeTask.value = startedTasks.value.get(todoId)!
      activeTask.value.createdAt = Date.now()
    } else {
      activeTask.value = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        end: null,
        todoId,
        totalTime: 0,
      }

      startedTasks.value.set(todoId, {
        ...activeTask.value,
      })
    }
  }

  function isTodoStarted(todoId: string) {
    return startedTasks.value.has(todoId) || (activeTask.value && activeTask.value.todoId === todoId)
  }

  function pauseCurrentTodo() {
    if (!activeTask.value) {
      return
    }

    const existingTask = startedTasks.value.get(activeTask.value.id)
    startedTasks.value.set(activeTask.value.id, {
      ...activeTask.value,
      totalTime: (existingTask?.totalTime ?? 0) + Date.now() - activeTask.value.createdAt,
    })
    activeTask.value = null
  }
  return {
    finishedTasks,
    activeTask,
    hasActiveTodo,
    startedTasks,
    startTodo,
    pauseCurrentTodo,
    isTodoStarted,
    finishCurrentTodo,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTasksStore, import.meta.hot))
}
