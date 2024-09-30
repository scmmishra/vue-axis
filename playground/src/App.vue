<script lang="ts" setup>
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
  <div>
    <AxisChart
      :max-width="900"
      stacked
      :labels="labels"
      :dataset="dataset"
      :format-y="formatYAxis"
      :format-x="formatXAxis"
    />
  </div>
</template>
