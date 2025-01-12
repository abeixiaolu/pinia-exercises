<script setup lang="ts">
import { ref } from 'vue';

interface TreeFile {
  name: string
  children: TreeFile[]
}
const collapsed = ref(false)
defineProps<{
  file: TreeFile
}>()


const root = {
  name: 'root',
  children: [
    {
      name: 'documents', children: [
        { name: 'doc1.txt', children: [] },
        { name: 'doc2.txt', children: [] },
      ]
    },
    {
      name: 'downloads', children: [
        { name: 'file1.pdf', children: [] },
        { name: 'file2.pdf', children: [] },
      ]
    },
    {
      name: 'music', children: [
        { name: 'song1.mp3', children: [] },
        { name: 'song2.mp3', children: [] },
      ]
    },
  ],
}
</script>

<template>
  <div>
    <span v-if="file.children.length === 0">{{ file.name }}</span>
    <button v-else @click="collapsed = !collapsed">{{ file.name }} {{ collapsed ? '+' : '-' }}</button>
    <ul v-if="!collapsed && file.children.length">
      <li v-for="child in file.children" :key="child.name">
        <TreeFile :file="child" />
      </li>
    </ul>
  </div>
</template>