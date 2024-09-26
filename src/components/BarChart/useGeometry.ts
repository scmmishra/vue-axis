import { ref, watch, onMounted } from "vue";
import { useElementBounding, useParentElement } from "@vueuse/core";

interface PropsWithDefaults {
  labels: string[];
  dataset: { values: number[]; name: string; color: string }[];
  maxWidth: number;
  spaceRatio: number;
  offset: number;
  height?: number;
}

export default function useGeometry(props: PropsWithDefaults) {
  const parent = useParentElement();
  const { width: parentWidth, height: parentHeight } =
    useElementBounding(parent);

  let chartWidth = ref(useClamp(parentWidth, 0, props.maxWidth).value);
  let chartHeight = ref(props.height ?? Math.round(chartWidth.value / 2.6));
  let xOffset = ref(chartWidth.value - props.offset);
  let yOffset = ref(chartHeight.value - props.offset);

  const computeGeometry = () => {
    chartWidth.value = Math.max(Math.min(parentWidth.value, props.maxWidth), 0);
    chartHeight.value = props.height ?? Math.round(chartWidth.value / 2.6);

    xOffset.value = chartWidth.value - props.offset;
    yOffset.value = chartHeight.value - props.offset;
  };

  watch(() => props.maxWidth, computeGeometry);
  watch(() => props.height, computeGeometry);
  watch(() => props.offset, computeGeometry);

  onMounted(computeGeometry);

  return {
    chartWidth,
    chartHeight,
    xOffset,
    yOffset,
    parentWidth,
    parentHeight,
  };
}
