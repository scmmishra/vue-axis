<script setup>
import AxisChart from "./AxisChart.vue";
import { generateNumbers, generateDates } from "utils/generator";

const data = generateNumbers(20, 1, 8);
const labels = generateDates(20, "year");

const dataset = [
  {
    values: data,
    color: "#10b981",
    name: "Inflation Rate (%)",
  },
];
</script>

<template>
  <Story title="Axis Chart" :layout="{ type: 'grid', width: 900 }">
    <AxisChart :max-width="900" :labels="labels" :dataset="dataset" />
  </Story>
</template>
