<script setup lang="ts">
import { computed, onUnmounted, provide, Ref, ref, watch } from 'vue';
import { registerTabKey } from './injectionKey';

const props = defineProps<{
  modelValue?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const tabPanes = ref(new Map<number, string>())
const localCurrentTab = ref(0)
const selectedTab = computed({
  get: () => props.modelValue ?? localCurrentTab.value,
  set: (value) => {
    localCurrentTab.value = value
    emit('update:modelValue', value)
  }
})
let tabId = 0
const registerTab = (title: Ref<string>) => {
  const id = tabId++
  tabPanes.value.set(id, title.value)
  const isVisible = computed(() => selectedTab.value === id);

  watch(title, (newTitle) => {
    tabPanes.value.set(id, newTitle)
  })

  onUnmounted(() => {
    tabPanes.value.delete(id)
  })
  return { isVisible }
}

provide(registerTabKey, registerTab)

</script>

<template>
  <div class="space-x-1 space-y-1">
    <button v-for="[id, title] in tabPanes" :key="id" :disabled="selectedTab === id" @click="selectedTab = id">
      {{ title }}
    </button>
  </div>

  <slot />
</template>
