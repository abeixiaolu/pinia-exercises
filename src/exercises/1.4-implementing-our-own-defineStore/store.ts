import { ref, computed } from 'vue'
import { defineStore } from './my-pinia'


export const useCountStore = defineStore(() => {
  const n = ref(0)
  // variable instead of function because functions are hoisted
  const increment = (amount = 1) => {
    n.value += amount
  }
  const double = computed(() => n.value * 2)

  return { n, double, increment }
})
