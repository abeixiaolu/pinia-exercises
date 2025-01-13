<script lang="ts" setup>
import { computed } from 'vue';
import { useGradientGenerator } from './gradient-generator';


const gradientGenerator = useGradientGenerator()

const currentHistory = computed({
  get() {
    return {
      colors: gradientGenerator.colors,
      angle: gradientGenerator.angle,
    }
  },
  set(value) {
    gradientGenerator.colors = value.colors.slice()
    gradientGenerator.angle = value.angle
  }
})
</script>

<template>
  <h1 class="mb-5">Gradient Generator</h1>

  <div class="my-2 space-x-1">
    <button data-test="btn-reset" @click="gradientGenerator.reset()">Reset</button>
    <button data-test="btn-randomize" @click="gradientGenerator.randomize()">Randomize</button>
    <button data-test="btn-clipboard" @click="gradientGenerator.copyToClipboard()">Copy to Clipboard</button>
  </div>

  <label>
    Select a history random color
    <select v-if="gradientGenerator.randomHistory.length > 0" v-model="currentHistory" data-test="btn-history">
      <option v-for="(history, index) in gradientGenerator.randomHistory" :key="index" :value="history">{{
        `${history.colors.join(', ')} / ${history.angle}` }}</option>
    </select>
  </label>

  <div :style="gradientGenerator.gradientString" class="rounded gradient-preview"></div>

  <div class="flex py-1 my-2">
    <label class="flex items-center">
      <span>Angle: </span>
      <input v-model="gradientGenerator.angle" data-test="angle-value-range" class="mx-3" type="range" step="1" min="0"
        max="360" />
    </label>
    <input v-model="gradientGenerator.angle" data-test="angle-value-number" type="number" min="0" max="360" />
  </div>

  <div class="flex flex-wrap">
    <!-- Display a swatch of each color in the gradient -->
    <div v-for="(color, index) in gradientGenerator.colors" :key="index" class="flex flex-col items-center group">
      <input class="w-12 h-10 p-1 m-1" type="color" :value="color"
        @input="gradientGenerator.updateColor(index, $event)" />

      <!-- Should remove color when this button is clicked -->
      <button class="invisible w-5 h-5 p-0 group-hover:visible" data-test="btn-remove-color" title="Remove this color"
        :disabled="!gradientGenerator.canRemoveColor" @click="gradientGenerator.removeColor(index)">
        -
      </button>
    </div>

    <button class="w-12 h-10 p-1 m-1" data-test="btn-add-color" title="Add Color"
      @click="gradientGenerator.addColor">+</button>
  </div>
</template>

<style scoped>
.gradient-preview {
  aspect-ratio: 2 / 1;
  background-image: linear-gradient(#00c9ff, #92fe9d);
  min-height: 75px;
}
</style>
