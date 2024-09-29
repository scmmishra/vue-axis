<script setup>
import AxisChart from "./AxisChart.vue";
import { generateNumbers, generateDates } from "utils/generator";

const dataCount = 15;

const openConvCount = generateNumbers(dataCount, 1, 100);
const resolvedConvCount = generateNumbers(dataCount, 1, 100);
const archivedConvCount = generateNumbers(dataCount, 1, 100);
const labels = generateDates(dataCount, "day");

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
  {
    values: archivedConvCount,
    color: colors[0],
    name: "Conversations archived",
    type: "bar",
  },
];
</script>

<template>
  <Story
    title="Axis Chart"
    :layout="{ type: 'grid', width: 900 }"
    auto-props-disabled
  >
    <Variant title="Stacked">
      <AxisChart
        :max-width="900"
        stacked
        :labels="labels"
        :dataset="dataset"
        :format-y="formatYAxis"
        :format-x="formatXAxis"
      />
    </Variant>
    <Variant title="Unstacked">
      <AxisChart
        :max-width="900"
        :labels="labels"
        :dataset="dataset"
        :format-y="formatYAxis"
        :format-x="formatXAxis"
      />
    </Variant>
  </Story>
</template>
