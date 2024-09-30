<script lang="ts" setup>
import AxisChart from "./AxisChart.vue";
import { generateNumbers, generateDates } from "utils/generator";

const dataCount = 15;

const openConvCount = generateNumbers(dataCount, 1, 100);
const resolvedConvCount = generateNumbers(dataCount, 1, 100);
const labels = generateDates(dataCount, "day");

const formatXAxis = (value) => {
  return new Date(value).getFullYear();
};

const formatYAxis = (value) => {
  return `${value}%`;
};

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
