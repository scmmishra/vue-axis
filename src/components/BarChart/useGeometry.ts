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

  const chartWidth = ref(0);
  const chartHeight = ref(0);

  const computeGeometry = () => {
    chartWidth.value = Math.max(Math.min(parentWidth.value, props.maxWidth), 0);
    chartHeight.value = props.height ?? Math.round(chartWidth.value / 2.6);
  };

  watch(() => props.maxWidth, computeGeometry);
  watch(() => props.height, computeGeometry);
  watch(() => props.offset, computeGeometry);

  onMounted(computeGeometry);

  return {
    chartWidth,
    chartHeight,
    parentWidth,
    parentHeight,
  };
}
