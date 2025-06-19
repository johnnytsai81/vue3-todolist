<script setup lang="ts">
import {computed, ref, watchEffect} from 'vue';
import type { FormData, FormItem } from "@/types"

interface Props {
  item: FormItem;
  modelValue: FormData;
  formDatas?: FormItem[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

// 單一欄位資料更新
const value = computed({
  get: () => {
    if (props.item.prop) {
      return (props.modelValue as any)[props.item.prop];
    }
    return null;
  },
  set: (newValue) => {
    if (props.item.prop) {
      emit('update:modelValue', {
        ...props.modelValue,
        [props.item.prop]: newValue
      } as FormData);
    }
  }
});

// 複合欄位資料更新
const updateInlineField = (fieldKey: string, fieldValue: any) => {
  const newValue = {
    ...props.modelValue,
    [fieldKey]: fieldValue
  } as FormData;

  emit('update:modelValue', newValue);
};

// 日期限制
const getMinDate = (prop: string, currentData: any): string => {
  // 結束日期：不能早於開始日期
  if (prop === 'end_date' && currentData.start_date) {
    const startDate = new Date(currentData.start_date);
    startDate.setDate(startDate.getDate() + 1);
    return startDate.toISOString().split('T')[0];
  }
  return '';
};

const getMaxDate = (prop: string, currentData: any): string => {
  // 開始日期：不能晚於結束日期
  if (prop === 'start_date' && currentData.end_date) {
    const endDate = new Date(currentData.end_date);
    endDate.setDate(endDate.getDate() - 1);
    return endDate.toISOString().split('T')[0];
  }
  return '';
};


const imagePreview = ref<string>('');

// 切換todo時更新圖片
watchEffect(() => {
  if (props.item.type === 'image-upload') {
    const currentValue = props.modelValue

    if (currentValue.image_url) {
      imagePreview.value = currentValue.image_url
    } else if (currentValue.image && currentValue.image instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string
      }
      reader.readAsDataURL(currentValue.image)
    } else {
      imagePreview.value = ''
    }
  }
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    emit('update:modelValue', {
      ...props.modelValue,
      image: file
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleImageUrlChange = (url: string) => {
  value.value = url;
  imagePreview.value = url;
};

// 計算字數
const characterCount = computed(() => {
  if (props.item.type === 'textarea' && value.value) {
    return value.value.length;
  }
  return 0;
});
</script>

<template>
  <div class="space-y-2" :class="item.span ? `lg:col-span-${item.span}` : ''">
    <!-- 標籤 -->
    <label
      v-if="item.label"
      class="block text-sm font-medium text-gray-700"
    >
      {{ item.label }}
    </label>

    <!-- 日期 -->
    <template v-if="item.type === 'date'">
      <div class="flex items-center">
        <input
          :value="props.modelValue.start_date || ''"
          @input="updateInlineField('start_date', ($event.target as HTMLInputElement).value)"
          type="date"
          :min="getMinDate('start_date', props.modelValue)"
          :max="getMaxDate('start_date', props.modelValue)"
          class="w-full py-3 px-3 bg-gray-200 rounded-lg"
        />
        <span class="text-gray-500 px-4">~</span>
        <input
          :value="props.modelValue.end_date || ''"
          @input="updateInlineField('end_date', ($event.target as HTMLInputElement).value)"
          type="date"
          :min="getMinDate('end_date', props.modelValue)"
          :max="getMaxDate('end_date', props.modelValue)"
          class="w-full py-3 px-3 bg-gray-200 rounded-lg"
        />
      </div>
    </template>

    <!-- 文字輸入 -->
    <template v-else-if="item.type === 'text'">
      <input
        v-model="value"
        type="text"
        :placeholder="item.placeholder"
        :required="item.required"
        :maxlength="item.maxLength"
        class="w-full px-3 py-3 rounded-lg bg-gray-200"
      />
    </template>

    <!-- 圖片上傳 -->
    <template v-else-if="item.type === 'image-upload'">
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div
            class="rounded-lg bg-green-200 hover:bg-green-300 text-[20px] text-center transition-all">
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              class="hidden"
              id="imageUpload"
            />
            <label
              for="imageUpload"
              class="cursor-pointer block px-4 py-[11px]"
            >
              <span class="text-gray-900">Upload Image</span>
            </label>
          </div>
          <div class="text-center text-[18px]">or</div>
          <input
            :value="value"
            @input="handleImageUrlChange(($event.target as HTMLInputElement).value)"
            type="url"
            :placeholder="item.placeholder"
            class="w-full px-3 py-3 bg-gray-200 rounded-lg"
          />
        </div>
        <div v-if="imagePreview" class="w-full h-full">
          <img
            :src="imagePreview"
            alt="預覽圖片"
            class="w-full h-[160px] object-cover rounded-lg"
          />
        </div>
        <div v-else class="bg-gray-200 w-full h-full rounded-lg"></div>
      </div>
    </template>

    <!-- 文字區域 -->
    <template v-else-if="item.type === 'textarea'">
      <div class="relative">
        <textarea
          v-model="value"
          :placeholder="item.placeholder"
          :rows="item.rows || 5"
          :maxlength="item.maxLength"
          style="resize: none"
          class="w-full px-3 py-3 bg-gray-200 rounded-lg"
        ></textarea>

        <div
          v-if="item.maxLength"
          class="absolute bottom-2 right-0 bg-green-200 px-3 py-2 rounded-br-lg before:absolute before:-left-[30px] before:top-0 before:w-0 before:h-0 before:border-t-[40px] before:border-t-transparent before:border-r-[30px] before:border-r-green-200 before:border-b-0 before:border-l-0"
        >
          {{ item.maxLength }}/{{ characterCount }}
        </div>
      </div>
    </template>
  </div>
</template>