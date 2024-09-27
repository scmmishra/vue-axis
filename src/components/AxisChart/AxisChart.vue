<script setup>
import SVGText from "./SVGText.vue";
import { computed } from "vue";
import useGeometry from "./useGeometry";
import useNiceNumbers from "./useNiceNumbers";

/**
 * @typedef {Object} DatasetItem
 * @property {number[]} values - Array of numerical values
 * @property {string} name - Name of the dataset
 * @property {string} color - Color of the dataset
 */

/**
 * @type {import('vue').PropType<{
 *   labels: string[],
 *   dataset: DatasetItem[],
 *   height?: number,
 *   maxWidth?: number,
 *   spaceRatio?: number,
 *   xOffset?: number,
 *   yOffset?: number,
 *   disableAnimation?: boolean,
 *   animationDuration?: number
 * }>}
 */
const props = defineProps({
  labels: { type: Array, required: true },
  dataset: { type: Array, required: true },
  height: { type: Number, default: null },
  maxWidth: { type: Number, default: 800 },
  spaceRatio: { type: Number, default: 0.2 },
  xOffset: { type: Number, default: 20 },
  yOffset: { type: Number, default: 20 },
  disableAnimation: { type: Boolean, default: false },
  animationDuration: { type: Number, default: 100 },
  formatX: { type: Function, default: null },
  formatY: { type: Function, default: null },
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

const getAnimationDelay = (index) => {
  return index * 2;
};

function isDate(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}

const formatTick = (tick) => {
  if (props.formatY) {
    return props.formatY(tick);
  }

  return tick;
};

const formatLabel = (label) => {
  if (isDate(label) && !props.formatX) {
    return label.toLocaleDateString();
  }

  if (props.formatX) {
    return props.formatX(label);
  }

  return label;
};
</script>

<template>
  <svg :width="containerWidth" :height="containerHeight">
    <g>
      <SVGText
        v-for="value in ticks"
        :x="leftmargin - 10"
        :y="getYPosition(value) + 3"
        text-anchor="end"
      >
        {{ formatTick(value) }}
      </SVGText>
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
    <g>
      <SVGText
        v-for="(label, index) in labels"
        :x="getxPosition(index)"
        :y="containerHeight"
        :width="barWidth"
      >
        {{ formatLabel(label) }}
      </SVGText>
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
