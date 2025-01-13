import { useClipboard } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useGradientGenerator = defineStore('gradient-generator', () => {
  // build out your composable here
  const colors = ref<string[]>(['#00c9ff', '#92fe9d'])
  const randomHistory = ref<Array<{ colors: string[]; angle: number }>>([])
  const angle = ref(90)

  const canRemoveColor = computed(() => colors.value.length > 1)

  const gradientString = computed(() => {
    return `background-image: linear-gradient(${angle.value}deg, ${colors.value.join(',')});`
  })

  function addColor() {
    colors.value.push(randomColor())
  }

  function removeColor(index: number) {
    if (canRemoveColor.value) {
      colors.value.splice(index, 1)
    }
  }

  function updateColor(index: number, event: Event) {
    colors.value[index] = (event.target as HTMLInputElement).value
  }

  function reset() {
    colors.value = ['#00c9ff', '#92fe9d']
    angle.value = 0
  }

  const { copy: copyToClipboard } = useClipboard({ source: gradientString })

  function randomize() {
    const randomColorAngle = Math.floor(Math.random() * 360)
    const randomColorCount = Math.floor(Math.random() * 4) + 2
    colors.value = Array.from({ length: randomColorCount }, () => randomColor())
    angle.value = randomColorAngle
    randomHistory.value.push({ colors: colors.value.slice(), angle: angle.value })
  }

  return {
    gradientString,
    colors,
    canRemoveColor,
    angle,
    randomHistory,
    addColor,
    removeColor,
    updateColor,
    reset,
    randomize,
    copyToClipboard,
  }
})

/**
 * Utility function for generating a random color
 */
function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    // the input also does lowercase so this is more consistent
    .toLowerCase()
    .padStart(6, '0')}`
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGradientGenerator, import.meta.hot))
}
