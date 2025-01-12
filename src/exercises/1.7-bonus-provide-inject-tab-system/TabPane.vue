<script setup lang="ts">
import { inject, toRef } from 'vue';
import { registerTabKey } from './injectionKey';

const props = defineProps<{ title: string }>()

const useTab = inject(registerTabKey)!

const { isVisible } = useTab(toRef(props, 'title'))

</script>

<template>
  <slot v-if="isVisible" />
</template>
