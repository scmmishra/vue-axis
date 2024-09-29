<script setup>
import AxisChart from "./AxisChart.vue";
import { generateNumbers, generateDates } from "utils/generator";

const openConvCount = generateNumbers(15, 1, 100);
const resolvedConvCount = generateNumbers(15, 1, 100);
const labels = generateDates(15, "day");

const colors = [
  "#c7d2fe",
  "#a5b4fc",
  "#818cf8",
  "#6366f1",
  "#4f46e5",
  "#4338ca",
  "#3730a3",
  "#312e81",
  "#1e1b4b",
];

const formatXAxis = (value) => {
  return new Date(value).getFullYear();
};

const formatYAxis = (value) => {
  return `${value}%`;
};

const dataset = [
  {
    values: openConvCount,
    color: colors[7],
    name: "Conversations open",
    type: "bar",
  },
  {
    values: resolvedConvCount,
    color: colors[3],
    name: "Conversations resolved",
    type: "bar",
  },
];
</script>

<template>
  <Story title="Axis Chart" :layout="{ type: 'grid', width: 900 }">
    <AxisChart
      :max-width="900"
      :labels="labels"
      :dataset="dataset"
      stacked
      :format-y="formatYAxis"
      :format-x="formatXAxis"
    />
  </Story>
</template>
