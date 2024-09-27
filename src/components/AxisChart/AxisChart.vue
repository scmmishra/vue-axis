<script setup lang="ts">
import { computed } from "vue";
import useGeometry from "./useGeometry";
import useNiceNumbers from "./useNiceNumbers";

export interface Props {
  labels: string[];
  dataset: { values: number[]; name: string; color: string }[];
  height?: number;
  maxWidth?: number;
  spaceRatio?: number;
  xOffset?: number;
  yOffset?: number;
  disableAnimation?: boolean;
  animationDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  xOffset: 20,
  yOffset: 20,
  spaceRatio: 0.2,
  maxWidth: 800,
  disableAnimation: false,
  animationDuration: 100,
});

const maxValue = computed(() => {
  return Math.max(...props.dataset.map((item) => Math.max(...item.values)));
});
const ticks = computed(() => useNiceNumbers(0, maxValue.value));
const maxEffectiveValue = computed(() => ticks.value[ticks.value.length - 1]);

const {
  leftmargin,
  containerWidth,
  containerHeight,
  barWidth,
  getHeight,
  getYPosition,
  getxPosition,
  drawWidth,
} = useGeometry(props, maxEffectiveValue);

const getAnimationDelay = (index: number) => {
  return index * 2;
};
</script>

<template>
  <svg :width="containerWidth" :height="containerHeight">
    <g>
      <text
        v-for="value in ticks"
        :x="leftmargin - String(value).length * 6"
        text-anchor="end"
        :y="getYPosition(value) + 3"
      >
        <tspan
          :style="{
            fontSize: '12px',
            fontFamily: 'sans-serif',
            fill: '#9ca3af',
            fontWeight: 300,
          }"
        >
          {{ `${value}%` }}
        </tspan>
      </text>
    </g>
    <g>
      <line
        v-for="value in ticks"
        stroke="#e5e7eb"
        :width="containerWidth - leftmargin"
        :x1="leftmargin"
        :x2="containerWidth"
        :y1="getYPosition(value)"
        :y2="getYPosition(value)"
      />
    </g>
    <g v-for="item in dataset" :data-q-name="item.name" :data-width="drawWidth">
      <rect
        v-for="(value, index) in item.values"
        :x="getxPosition(index)"
        :y="containerHeight - props.yOffset"
        :data-idx="index"
        :width="barWidth"
        :height="0"
        :fill="item.color"
      >
        <animate
          v-if="!disableAnimation"
          attributeName="height"
          :from="0"
          :to="getHeight(value)"
          :dur="`${props.animationDuration}ms`"
          :begin="`${getAnimationDelay(index)}ms`"
          fill="freeze"
          calcMode="spline"
          keySplines="0.215, 0.61, 0.355, 1"
        />
        <animate
          v-if="!disableAnimation"
          attributeName="y"
          :from="containerHeight - props.yOffset"
          :to="getYPosition(value)"
          :dur="`${props.animationDuration}ms`"
          :begin="`${getAnimationDelay(index)}ms`"
          fill="freeze"
          calcMode="spline"
          keySplines="0.215, 0.61, 0.355, 1"
        />
      </rect>
    </g>
  </svg>
</template>
