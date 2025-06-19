import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { FormData } from '@/types'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todoData: [] as FormData[]
  }),

  getters: {
    activeTodo: (state) => state.todoData.find(item => item.active),
    todoCount: (state) => state.todoData.length
  },

  actions: {
    // 初始化資料（從 localStorage 載入）
    initTodos() {
      const stored = localStorage.getItem('todoData')
      if (stored) {
        try {
          this.todoData = JSON.parse(stored)
        } catch (error) {
          console.error('載入 localStorage 資料失敗:', error)
          this.setDefaultData()
        }
      } else {
        this.setDefaultData()
      }
    },

    // 設置預設資料
    setDefaultData() {
      this.todoData = [
        {
          id: this.generateId(),
          title: 'item title',
          start_date: '',
          end_date: '',
          image: null,
          image_url: '',
          content: '',
          active: true,
        },
        {
          id: this.generateId(),
          title: 'new item title',
          start_date: '',
          end_date: '',
          image: null,
          image_url: '',
          content: '',
          active: false,
        },
      ]
      this.saveToStorage()
    },

    // 儲存到 localStorage
    saveToStorage() {
      // 處理 File 物件，因為 File 無法直接序列化
      const dataToSave = this.todoData.map(todo => ({
        ...todo,
        image: todo.image ? {
          name: todo.image.name,
          size: todo.image.size,
          type: todo.image.type,
          lastModified: todo.image.lastModified
        } : null
      }))
      localStorage.setItem('todoData', JSON.stringify(dataToSave))
    },

    // 新增項目
    addTodo() {
      const newId = this.generateId()
      const newTodo: FormData = {
        id: newId,
        active: false,
        title: "new item title",
        start_date: "",
        end_date: "",
        image: null,
        image_url: "",
        content: "",
      }

      this.todoData.push(newTodo)
      this.saveToStorage()
      return newId
    },

    // 更新項目
    updateTodo(id: string, formData: FormData) {
      const index = this.todoData.findIndex(item => item.id === id)
      if (index !== -1) {
        // 保留 id 和 active 狀態，更新其他 FormData 欄位
        this.todoData[index] = {
          ...this.todoData[index],
          ...formData
        }
        this.saveToStorage()
      }
    },

    // 刪除項目
    deleteTodo(id: string) {
      const index = this.todoData.findIndex(item => item.id === id)
      if (index !== -1) {
        const wasActive = this.todoData[index].active
        this.todoData.splice(index, 1)

        // 如果刪除的是活躍項目，且還有其他項目
        if (wasActive && this.todoData.length > 0) {
          // 選擇前一筆，如果是第一筆則選擇新的第一筆
          const newActiveIndex = index > 0 ? index - 1 : 0
          this.todoData[newActiveIndex].active = true
        }

        this.saveToStorage()
      }
    },

    // 設置活躍項目
    setActiveTodo(id: string) {
      this.todoData.forEach(item => {
        item.active = item.id === id
      })
      this.saveToStorage()
    },

    // 生成唯一 ID
    generateId(): string {
      return uuidv4()
    }
  }
})