<script lang="ts" setup>
import { AxisChart } from '@scmmishra/vue-axis'
import { computed, ref } from 'vue'
import { generateDates, generateNumbers } from './utils/generator'

const stacked = ref(true)
const spaceRatio = ref(0.2)
const xOffset = ref(20)
const yOffset = ref(20)
const dataCount = ref(15)

const openConvCount = computed(() => generateNumbers(dataCount.value, 1, 100))
const resolvedConvCount = computed(() =>
  generateNumbers(dataCount.value, 1, 100),
)
const labels = computed(() => generateDates(dataCount.value, 'day').reverse())

function formatXAxis(value: string | number | Date) {
  const date = new Date(value)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

function formatYAxis(value: number) {
  return `${value}%`
}

const dataset = computed(() => [
  {
    values: openConvCount.value,
    color: '#064e3b',
    name: 'Conversations open',
    type: 'bar',
  },
  {
    values: resolvedConvCount.value,
    color: '#4ade80',
    name: 'Conversations resolved',
    type: 'bar',
  },
])
</script>

<template>
  <section class="max-w-5xl mx-auto py-12">
    <h2 class="text-2xl font-bold mb-5">
      Stacked Bar Chart
    </h2>

    <div class="grid gap-2 max-w-sm">
      <label>
        <input v-model="stacked" type="checkbox">
        Stacked
      </label>
      <label class="grid">
        Space Ratio
        <input v-model="spaceRatio" type="range" min="0" max="1" step="0.1">
      </label>
      <label class="grid">
        Number of data points
        <input v-model="dataCount" type="range" min="5" max="50" step="0.1">
      </label>
    </div>
    <div
      class="p-5 shadow-sm outline outline-1 outline-gray-200 rounded-md mx-auto mt-5"
    >
      <div class="w-full">
        <AxisChart
          :max-width="1300"
          :height="400"
          :stacked="stacked"
          :space-ratio="Number(spaceRatio)"
          :labels="labels"
          :dataset="dataset"
          :x-offset="xOffset"
          :y-offset="yOffset"
          :format-y="formatYAxis"
          :format-x="formatXAxis"
        />
      </div>
    </div>
  </section>
</template>
