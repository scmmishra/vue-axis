<script setup>
import { computed } from "vue";
import AnimateSVG from "./AnimateSVG.vue";
import { useAxisChart } from "composables/AxisChart/provider";

const props = defineProps({
  value: { type: Number, required: true },
  name: { type: String, required: true },
  outerIdx: { type: Number, required: true },
  index: { type: Number, required: true },
  color: { type: String, required: true },
});

const {
  getXPosition,
  getYPosition,
  barWidth,
  yOffset,
  containerHeight,
  getHeight,
  getAnimationDelay,
  dataset,
  stacked,
  disableAnimation,
} = useAxisChart();

const getPreviousHeight = (index, datasetIdx) => {
  if (datasetIdx === 0) {
    return 0;
  }

  const prevValues = dataset[datasetIdx - 1];
  const previousValue = prevValues.values[index];

  // count down to zero idx to capture the heights of all pervious datasets
  return getHeight(previousValue) + getPreviousHeight(index, datasetIdx - 1);
};

const barHeight = computed(() => getHeight(props.value));
const startY = computed(() => containerHeight.value - yOffset);

const numberOfCols = computed(() => {
  if (stacked) {
    return 1;
  }

  return dataset.length;
});

const xPos = computed(() => {
  if (stacked) {
    return getXPosition(props.index);
  }

  const widthPerCol = barWidth.value / numberOfCols.value;
  const offset = widthPerCol * props.outerIdx;
  return getXPosition(props.index) + offset;
});

const yPos = computed(() => {
  if (stacked) {
    return (
      getYPosition(props.value) - getPreviousHeight(props.index, props.outerIdx)
    );
  }

  return getYPosition(props.value);
});
</script>

<template>
  <rect
    :x="xPos"
    :y="disableAnimation ? yPos : startY"
    :data-idx="index"
    :data-value="value"
    :data-name="name"
    :width="barWidth / numberOfCols"
    :height="disableAnimation ? barHeight : 0"
    :fill="color"
  >
    <AnimateSVG
      attributeName="height"
      :from="0"
      :to="barHeight"
      :delay="getAnimationDelay(index)"
    />
    <AnimateSVG
      attributeName="y"
      :from="startY"
      :to="yPos"
      :delay="getAnimationDelay(index)"
    />
  </rect>
</template>
