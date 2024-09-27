import { ref, watch, onMounted, computed } from "vue";
import { useElementBounding, useParentElement } from "@vueuse/core";

const leftmargin = 50;

export default function useGeometry(props, maxValue) {
  const parent = useParentElement();
  const { width: parentWidth, height: parentHeight } =
    useElementBounding(parent);

  const containerWidth = ref(0);
  const containerHeight = ref(0);

  const computeGeometry = () => {
    containerWidth.value = Math.max(
      Math.min(parentWidth.value, props.maxWidth),
      0,
    );
    containerHeight.value =
      props.height ?? Math.round(containerWidth.value / 2.6);
  };

  watch(() => props.maxWidth, computeGeometry);
  watch(() => props.height, computeGeometry);

  const yScale = computed(() => {
    return (containerHeight.value - 2 * props.yOffset) / maxValue.value;
  });

  const drawWidth = computed(() => {
    const widthWithoutMargin = containerWidth.value - leftmargin;
    return widthWithoutMargin - 2 * props.xOffset;
  });

  const barWidth = computed(() => {
    const xScale = drawWidth.value / props.labels.length;
    return xScale * (1 - props.spaceRatio);
  });

  const barGap = computed(() => {
    const xScale = drawWidth.value / props.labels.length;
    return xScale * props.spaceRatio;
  });

  function getHeight(value) {
    return value * yScale.value;
  }

  function getYPosition(value) {
    return containerHeight.value - getHeight(value) - props.yOffset;
  }

  function getxPosition(index) {
    if (index === 0) {
      // shift this by barGap / 2 to align the gap halfway on each side of the bar
      return leftmargin + props.xOffset + barGap.value / 2;
    }

    const effectiveBarWidth = barWidth.value + barGap.value;
    // shift this by barGap / 2 to align the gap halfway on each side of the bar
    return (
      index * effectiveBarWidth + props.xOffset + leftmargin + barGap.value / 2
    );
  }

  onMounted(computeGeometry);

  return {
    leftmargin,
    containerWidth,
    barWidth,
    barGap,
    containerHeight,
    parentWidth,
    parentHeight,
    getHeight,
    drawWidth,
    getYPosition,
    getxPosition,
  };
}
