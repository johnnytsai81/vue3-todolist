<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import FormList from "@/components/FormList.vue"
import { HugeiconsIcon } from '@hugeicons/vue'
import { Delete02Icon, Menu01Icon } from '@hugeicons/core-free-icons'
import type { FormData, FormItem } from "@/types"
import { useTodoStore } from '@/stores/todoStore'
import {useUtilityStore} from "@/stores/utilityStore.ts";
const todoStore = useTodoStore()
const utilityStore = useUtilityStore()

onMounted(() => {
  todoStore.initTodos()
})

const form = computed({
  get: (): FormData => {
    const activeTodo = todoStore.activeTodo
    if (activeTodo) {
      return activeTodo
    }
    return {
      id: "",
      active: false,
      title: "",
      start_date: "",
      end_date: "",
      image: null,
      image_url: "",
      content: "",
    }
  },
  set: (newValue: FormData) => {
    const activeTodo = todoStore.activeTodo
    if (activeTodo) {
      todoStore.updateTodo(activeTodo.id, newValue)
    }
  }
})

// 刪除當前活躍的 todo
const deleteCurrent = () => {
  const activeTodo = todoStore.activeTodo
  if (activeTodo && confirm('確定要刪除這個項目嗎？')) {
    todoStore.deleteTodo(activeTodo.id)
  }
}

// 收合選單
const handleMenu = () => {
  utilityStore.setMenuShow(true)
}

const formDatas: FormItem[] = [
  {
    prop: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'title...'
  },
  {
    type: "date",
    label: "Date",
    dateFields: {
      start: 'start_date',
      end: 'end_date'
    }
  },
  {
    prop: 'image_url',
    label: 'Image',
    type: 'image-upload',
    placeholder: '請輸入圖片網址',
    span: 2,
  },
  {
    prop: 'content',
    label: 'Content',
    type: 'textarea',
    placeholder: 'content...',
    maxLength: 200,
    rows: 10,
    span: 2,
  }
];

</script>

<template>
  <DefaultLayout>
    <div class="p-6">
      <div class="flex items-centerm justify-between mb-4">
        <HugeiconsIcon @click="handleMenu()" class="block lg:hidden hover:text-green-400 transition-all duration-300 cursor-pointer" :icon="Menu01Icon" :size="24" color="currentColor" />
        <HugeiconsIcon @click="deleteCurrent()" class="block ml-auto hover:text-green-400 transition-all duration-300 cursor-pointer" :icon="Delete02Icon" :size="24" color="currentColor" :strokeWidth="1.5" />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <template
          v-for="(item, index) in formDatas"
          :key="index"
        >
          <FormList
            :item="item"
            v-model="form"
          />
        </template>
      </div>
    </div>
  </DefaultLayout>
</template>
