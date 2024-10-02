import { computed, ComputedRef } from "vue";

import useNiceNumbers from "../useNiceNumbers";

export type DatasetItem = {
  values: number[];
  name: string;
  color: string;
  type?: "bar" | "line";
};

interface Props {
  dataset: DatasetItem[];
  stacked: boolean;
}

function mergeArrays(arrays: number[][]): number[] {
  const merged: number[] = [];

  arrays.forEach((array) => {
    array.forEach((value, index) => {
      if (!merged[index]) {
        merged[index] = 0;
      }

      merged[index] += value;
    });
  });

  return merged;
}

export default function useDataset(props: Props) {
  const getMaxValue = (dataset: DatasetItem[], stacked: boolean): number => {
    if (stacked) {
      const values = dataset.map((item) => item.values);
      const merged = mergeArrays(values);
      return Math.max(...merged);
    }

    return Math.max(...props.dataset.map((item) => Math.max(...item.values)));
  };

  const maxValue: ComputedRef<number> = computed(() =>
    getMaxValue(props.dataset, props.stacked),
  );
  const ticks: ComputedRef<number[]> = computed(() =>
    useNiceNumbers(0, maxValue.value),
  );
  const maxEffectiveValue: ComputedRef<number> = computed(
    () => ticks.value[ticks.value.length - 1],
  );

  const cleanedDataset = computed(() => {
    return props.dataset.map((item) => {
      return {
        ...item,
        type: item.type || "bar",
      };
    });
  });

  return {
    maxValue,
    ticks,
    maxEffectiveValue,
    cleanedDataset,
  };
}
