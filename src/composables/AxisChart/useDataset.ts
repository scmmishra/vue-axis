import { computed, ComputedRef } from "vue";

import useNiceNumbers from "../useNiceNumbers";

interface DatasetItem {
  values: number[];
}

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

export default function useDataset(
  dataset: DatasetItem[],
  stacked: ComputedRef<boolean>,
) {
  const getMaxValue = (
    dataset: DatasetItem[],
    stacked: ComputedRef<boolean>,
  ): number => {
    if (stacked.value) {
      const values = dataset.map((item) => item.values);
      const merged = mergeArrays(values);
      return Math.max(...merged);
    }

    return Math.max(...dataset.map((item) => Math.max(...item.values)));
  };

  const maxValue: ComputedRef<number> = computed(() => {
    console.log("maxValue computed");
    return getMaxValue(dataset, stacked);
  });
  const ticks: ComputedRef<number[]> = computed(() =>
    useNiceNumbers(0, maxValue.value),
  );
  const maxEffectiveValue: ComputedRef<number> = computed(
    () => ticks.value[ticks.value.length - 1],
  );

  return {
    maxValue,
    ticks,
    maxEffectiveValue,
  };
}
