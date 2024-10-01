<script lang="ts" setup>
import { ref } from "vue";
import { AxisChart } from "../../src";
import { generateNumbers, generateDates } from "./utils/generator";

const dataCount = 15;

const openConvCount = generateNumbers(dataCount, 1, 100);
const resolvedConvCount = generateNumbers(dataCount, 1, 100);
const labels = generateDates(dataCount, "day");

const formatXAxis = (value: string | number | Date) => {
  return new Date(value).getFullYear();
};

const formatYAxis = (value: number) => {
  return `${value}%`;
};

const stacked = ref(true);

const dataset = [
  {
    values: openConvCount,
    color: "#064e3b",
    name: "Conversations open",
    type: "bar",
  },
  {
    values: resolvedConvCount,
    color: "#4ade80",
    name: "Conversations resolved",
    type: "bar",
  },
];
</script>

<template>
  <section class="max-w-5xl mx-auto py-12">
    <h2 class="text-2xl font-bold mb-5">Stacked Bar Chart</h2>
    <div>
      <span class="text-gray-600">Controls</span>
      <div>
        <label>
          <input type="checkbox" v-model="stacked" />

          Stacked
        </label>
      </div>
    </div>
    <div
      class="p-5 shadow-sm outline outline-1 outline-gray-200 rounded-md mx-auto mt-5"
    >
      <div class="w-full">
        <AxisChart
          :max-width="1300"
          :height="400"
          :stacked="stacked"
          :labels="labels"
          :dataset="dataset"
          :format-y="formatYAxis"
          :format-x="formatXAxis"
        />
      </div>
    </div>
  </section>
</template>
