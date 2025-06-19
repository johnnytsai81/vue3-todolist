<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import { HugeiconsIcon } from '@hugeicons/vue'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { useUtilityStore } from '@/stores/utilityStore'

const todoStore = useTodoStore()
const utilityStore = useUtilityStore()

// 初始化資料
onMounted(() => {
  todoStore.initTodos()
  getRandomImage()
})

// 隨機圖片 URL
const randomImageUrl = ref('')

// 取得隨機圖片
const getRandomImage = () => {
  const width = 400
  const height = 160
  const randomId = Math.floor(Math.random() * 100)
  randomImageUrl.value = `https://picsum.photos/${width}/${height}?random=${randomId}`
}

// 點擊項目設為active
const handleTodoClick = (id: string) => {
  todoStore.setActiveTodo(id)
}

// 新增項目
const handleAddItem = () => {
  const newId = todoStore.addTodo()
  todoStore.setActiveTodo(newId)
}

// 收合選單
const handleMenu = () => {
  utilityStore.setMenuShow(false)
}
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <div class="overflow-y-scroll">
      <div class="flex items-center justify-between px-[24px] py-[32px]">
        <div class="text-[24px] xl:text-[32px] font-medium">Demo Todo List</div>
        <HugeiconsIcon class="block xl:hidden hover:text-green-400 transition-all duration-300 cursor-pointer" @click="handleMenu()" :icon="Cancel01Icon" :size="24" color="currentColor" />
      </div>
      <div class="flex flex-col gap-1.5">
        <template v-for="(todo, todoIndex) in todoStore.todoData" :key="todo.id">
          <div
            class="relative bg-green-400 text-[20px] px-6 py-2 cursor-pointer hover:bg-green-500 transition-colors group"
            :class="todo.active ? 'font-bold todo-active' : ''"
            @click="handleTodoClick(todo.id)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="font-medium line-clamp-1">{{ todoIndex + 1 }}. {{ todo.title }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="p-6">
        <div class="main-btn" @click="handleAddItem">Add Item</div>
      </div>
    </div>
    <div class="p-6">
      <img
        :src="randomImageUrl"
        alt="預覽圖片"
        class="w-full h-[120px] object-cover rounded-lg cursor-pointer"
        @click="getRandomImage"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todo-active::before{
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 0;
  height: 0;
  border-top: 24px solid transparent;
  border-right: 24px solid white;
  border-bottom: 24px solid transparent;
}
</style>