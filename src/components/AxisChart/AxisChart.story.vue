<script setup>
import AxisChart from "./AxisChart.vue";
import { generateNumbers, generateDates } from "utils/generator";

const data = generateNumbers(15, 1, 100);
const labels = generateDates(15, "year");

const formatXAxis = (value) => {
  return new Date(value).getFullYear();
};

const formatYAxis = (value) => {
  return `${value}%`;
};

const dataset = [
  {
    values: data,
    color: "#2dd4bf",
    name: "Inflation Rate (%)",
  },
];
</script>

<template>
  <Story title="Axis Chart" :layout="{ type: 'grid', width: 900 }">
    <AxisChart
      :max-width="900"
      :labels="labels"
      :dataset="dataset"
      :format-y="formatYAxis"
      :format-x="formatXAxis"
    />
  </Story>
</template>
